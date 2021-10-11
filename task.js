var options = ["Angular", "React JS", "Vue JS", "C Language", "C++", "Java", "Javascript", "Objective-C", "PHP", "Python", "SQL"];
var selectedoptions = [];

document.addEventListener(
  "DOMContentLoaded",
  function () {
    createOptions();
    customDrag();
  },
  false
);

function createOptions() {
  let searchOption = document.getElementById("left_searchbox").value.toUpperCase();
  const name = document.getElementsByClassName("left_options")[0];
  name.innerHTML = "";

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
    }
    else {
      let display = `<div class="nodata"><i class="fas fa-search fa-8x"></i><p>Search Not Found</p></div>`;
      name.innerHTML = display
    }
  }
  setEventOnDraggable();
}

function setEventOnDraggable() {
  const draggables = document.querySelectorAll('.optioncontainer')

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', event.target.id);
      draggable.classList.add('dragging')
      event.dataTransfer.effectAllowed = "move";
    })

    draggable.addEventListener('dragend', (e) => {
      draggable.classList.remove('dragging')
    })
  })
}

function optionBox(value, i) {
  const id = value.split(" ").join("").replace(/[^0-9a-z]/gi, '');
  const name = document.getElementById("left_options");
  let div = document.createElement('div');

  div.setAttribute('id', `optionbox${id}`);
  div.setAttribute('class', "draggable optioncontainer")
  div.innerHTML = ` <div  class='optionbox'><p>${value}</p><i class="fas fa-grip-vertical" ></i></div> <i class="fas fa-trash-alt fa-lg deletebtn" onclick='deleteoptions("optionbox${id}","${value}")'></i> `;
  div.setAttribute('draggable', true)
  name.appendChild(div);
}

function deleteoptions(id, value) {
  myobj = document.querySelectorAll(`#${id}`)[0];
  myobj.parentNode.removeChild(myobj);
  options.push(value)
  createOptions();
  getSelectedList();

}

function getSelectedList() {
  let searchOption = document.getElementById("left_searchbox").value.toUpperCase();
  const list = document.getElementById("right_options")
  const dropzoneId = document.getElementById("dropzone");

  list_values = [].slice.call(list.childNodes).map(function (node) {
    return node.getElementsByTagName('p')[0].innerHTML;
  })
  selectedoptions = list_values
  list_values.forEach(val => {
    let index = options.indexOf(val);
    if (index > -1) {
      options.splice(index, 1);
    }
  });
  selectedoptions.length > 0 ?
    (document.getElementsByClassName("dropicon")[0].style.display = "none", dropzoneId.classList.add("dropzone_sm"), dropzoneId.classList.remove("dropzone_lg")) :
    (document.getElementsByClassName("dropicon")[0].style.display = "block", dropzoneId.classList.add("dropzone_lg"), dropzoneId.classList.remove("dropzone_sm"));
  searchOption ? createOptions() : "";

}

function customDrag() {
  const containers = document.querySelectorAll('#right_options')
  const dropzones = document.querySelectorAll('#dropzone')
  containers.forEach(container => {
    let afterElement;
    container.addEventListener('dragover', e => {
      e.preventDefault()
    })

    container.addEventListener('drop', e => {
      const draggable = document.querySelector('.dragging')
      const afterElement = getClosestElement(container, e.clientY)
      if (afterElement == null) {
        container.appendChild(draggable)
      }
      else {
        container.insertBefore(draggable, afterElement)
      }
      getSelectedList();

    });
  })
  dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragover', e => {
      e.preventDefault()
    })

    dropzone.addEventListener('drop', event => {
      const id = event.dataTransfer.getData('text');
      const draggableElement = document.getElementById(id);
      const droparea = document.getElementById("right_options")
      droparea.prepend(draggableElement);
      event.dataTransfer.clearData();
      getSelectedList();
    })
  })

  function getClosestElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
      const childcontainer = child.getBoundingClientRect()
      const offset = y - childcontainer.top - childcontainer.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element
  }
}