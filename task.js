
var options = ["Angular", "React JS", "Vue JS", "C Language", "C++", "Java", "Javascript", "Objective-C", "PHP", "Python", "SQL"];
var selectedoptions = [];

document.addEventListener(
  "DOMContentLoaded",
  function () {
    createOptions();
    loadSelectedList();
  },
  false
);

function createOptions() {
  var searchOption = document.getElementById("left_searchbox").value.toUpperCase();
  const name = document.getElementsByClassName("left_options")[0];
  name.innerHTML = ""
  if (searchOption === "" || searchOption === undefined) {
    options.sort().forEach(function (value, i) {
      optionBox(value, i);

    });
  }
  else {
    const curentvalue = options.filter(val => val.toUpperCase().indexOf(searchOption.trim()) > -1)
    if (curentvalue.length) {
      curentvalue.forEach(function (value, i) {
        optionBox(value, i);
      });
    } else {
      let display = `<div class="nodata"><i class="fas fa-search fa-8x"></i><p>Search Not Found</p></div>`;
      name.innerHTML = display
    }
  }
  customDrag();

}


function optionBox(value, i) {
  const id = value.split(" ").join("").replace(/[^0-9a-z]/gi, '');
  const name = document.getElementById("leftoption");
  var div = document.createElement('div');
  div.setAttribute('id', `optionbox${id}`);
  div.setAttribute('class', "draggable optioncontainer")
  div.innerHTML = ` <div  class='optionbox'><p>${value}</p><i class="fas fa-grip-vertical" ></i></div> <i class="fas fa-trash-alt fa-lg deletebtn" onclick='deleteoptions("optionbox${id}","${value}")'></i> `;
  div.setAttribute('draggable', true)
  name.appendChild(div);
}

function customDrag() {
  const draggables = document.querySelectorAll('.optioncontainer')
  const containers = document.querySelectorAll('#right_options')
  const dropzones = document.querySelectorAll('#dropzone')
  draggables.forEach(draggable => {

    draggable.addEventListener('dragstart', (event) => {
      event
        .dataTransfer
        .setData('text/plain', event.target.id);
      draggable.classList.add('dragging')

    })

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging')
    })
  })
  containers.forEach(container => {
    let afterElement;
    container.addEventListener('dragover', e => {
      e.preventDefault()

    })
    container.addEventListener('drop', e => {
      const draggable = document.querySelector('.dragging')
      const afterElement = getDragAfterElement(container, e.clientY)

      if (afterElement == null) {
        container.appendChild(draggable)
      } else {
        container.insertBefore(draggable, afterElement)
      }
    });

  })
  dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragover', e => {
      e.preventDefault()

    })
    dropzone.addEventListener('drop', event => {
      const id = event
        .dataTransfer
        .getData('text');
      const draggableElement = document.getElementById(id);

      const droparea = document.getElementById("right_options")
      droparea.prepend(draggableElement);
      event.dataTransfer.clearData();

    })
  })

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element
  }
}

function deleteoptions(id, value) {
  myobj = document.querySelectorAll(`#${id}`)[0];
  myobj.parentNode.removeChild(myobj);
  options.push(value)
  createOptions();
  customDrag();
}

function loadSelectedList() {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  const list = document.getElementById("right_options")
  const config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  };
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        let list_values = [];
        list_values = [].slice.call(list.childNodes).map(function (node) {
          return node.getElementsByTagName('p')[0].innerHTML;
        })
        selectedoptions = list_values
        list_values.forEach(val => {
          let index = options.indexOf(val);
          if (index > -1) {
            options.splice(index, 1);
          }
        })
      }
    });
    const dropzoneId = document.getElementById("dropzone");
    selectedoptions.length > 0 ?
      (dropzoneId.style.height = "100px", dropzoneId.style.background = "white", document.getElementsByClassName("dropicon")[0].style.display = "none")
      : (dropzoneId.style.height = "600px", dropzoneId.style.background = "E5E5E5", document.getElementsByClassName("dropicon")[0].style.display = "block");
  });
  observer.observe(list, config);
}