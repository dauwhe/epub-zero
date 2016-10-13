(function() {
  if (!navigator.serviceWorker) return;

  var thisScriptURL = document.currentScript.src;
  
 

  // some nasty url hacking that should probably be done some other way
var urlRE = /^.*acme\/([^\/]+)\//.exec(location.href);

 var publicationBaseURL = location.origin + '/epub-zero/acme/'
 
console.log(publicationBaseURL);

  
 // var publicationBaseURL = '/' + getPathByName() + '/';
  
  //what folder is the manifest in
function getPathByName() {

//this is deeply flawed. fails on MobyDick/folder/manifest.json
 var path = RegExp('[?]manifest=' + '([^/]*)')
                    .exec(window.location.search);
 
    return path ?
        decodeURIComponent(path[1].replace(/\+/g, ' '))
        : null;

}

  var publicationName = getPathByName();
  
  console.log(publicationName);

  var ui = document.getElementById('page-controls');
  


 // navigator.serviceWorker.register(new URL('sw.js', thisScriptURL));
 navigator.serviceWorker.register('sw.js');


  if (navigator.serviceWorker.controller) {
    initPageControls();
  }
  else {
    navigator.serviceWorker.addEventListener('controllerchange', function onControllerChange() {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      initPageControls();
    });
  }

  function initPageControls() {
    caches.has(publicationName).then(function(isCached) {
      ui.innerHTML =
        '<span><label class="status"><input type="checkbox" class="work-offline">Save</label></span>' +
        '<span class="download"><a href="' + publicationBaseURL + publicationName + '/download-publication">Download</a></span>';
      
      
      

      var status = ui.querySelector('.status');
      var checkbox = ui.querySelector('.work-offline');

      checkbox.checked = isCached;

      checkbox.addEventListener('change', function(event) {
        if (!this.checked) {
          caches.delete(publicationName);
          status.textContent = "Removed";
        }
        else {
         status.textContent = "Offlinifying";
//console.log(publicationBaseURL);

          fetch(publicationBaseURL + publicationName + '/manifest.json', { mode: 'no-cors' }).then(function(response) {
            return response.json();
          }).then(function(dave) {
          
          
    newArray = dave.resources.map(function(el) { return el.href});
    
return dave.spine.map(function(el) { return el.href}).concat(newArray);

}).then(function(data) {


//console.log(data);

            data.push('manifest.json');
            
            publicationURL = publicationBaseURL + publicationName;
    //        console.log(publicationURL);

            
            return caches.open(publicationName).then(function(cache) {
              return cache.addAll(data.map(function(url) {
            //  console.log(new URL(publicationName + '/' + url, publicationBaseURL));
              
              
                return new URL(publicationName + '/' + url, publicationURL);
              }));
            });
          }).then(function() {
            // status.textContent = 'Offlinification complete!';
            alert("Offlinification complete!");
            status.textContent = "Saved";
          }).catch(function(err) {
            console.log(err);
            // status.textContent = 'Offlinification failed :(';
            alert("Offlinification failed!");
            status.textContent = "";
          });
        }
      });
    });
  }
}());