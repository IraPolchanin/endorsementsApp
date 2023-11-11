import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://playground-806d2-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")

const endorsementFieldEl = document.getElementById("endorsement-field")
const fromFieldEl = document.getElementById("from-field")
const toFieldEl = document.getElementById("to-field")
const addButtonEl = document.getElementById("add-button")
const endorsementListEl = document.getElementById("endorsements-list")

addButtonEl.addEventListener("click", function () {
  let fieldsValue = [toFieldEl.value, endorsementFieldEl.value, fromFieldEl.value, 0]
  push(endorsementListInDB, fieldsValue)

  clearInputFields()
})

onValue(endorsementListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val())

    clearEndorsementListEl()

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i]

      appendItemToEndorsementListEl(currentItem)
    }
  } else {
    endorsementListEl.innerHTML = "No items here... yet"
  }
})

function clearEndorsementListEl() {
  endorsementListEl.innerHTML = ""
}

function clearInputFields() {
  endorsementFieldEl.value = "";
  fromFieldEl.value = "";
  toFieldEl.value = "";
}

function appendItemToEndorsementListEl(item) {
  let itemID = item[0]
  let itemTo = item[1][0];
  let itemMessage = item[1][1];
  let itemFrom = item[1][2];
  let itemCount = item[1][3];
  let exactLocationOfItemInDB = ref(database, `endorsementList/${itemID}`)

  const newItem = document.createElement('li');
  newItem.setAttribute('class', 'endorsements-item');

  const newItemTo = document.createElement('p');
  newItemTo.setAttribute('class', 'endorsements-item-to');
  newItemTo.textContent = `To ${itemTo}`;

  const newItemMessage = document.createElement('p');
  newItemMessage.setAttribute('class', 'endorsements-item-message');
  newItemMessage.textContent = itemMessage;

  const newItemFooter = document.createElement('div');
  newItemFooter.setAttribute('class', 'endorsements-item-footer');
  const newItemFrom = document.createElement('p');
  newItemFrom.setAttribute('class', 'endorsements-item-from');
  newItemFrom.textContent = `From ${itemFrom}`;
  const likeCount = document.createElement('span');
  likeCount.setAttribute('class', 'endorsements-item-like');
  likeCount.textContent = `🖤 ${itemCount}`;
  newItemFooter.append(newItemFrom, likeCount);

  newItem.append(newItemTo, newItemMessage, newItemFooter);
  endorsementListEl.append(newItem);

  likeCount.addEventListener('click', function () {
    itemCount += 1;
    likeCount.textContent = `🖤 ${itemCount}`;
    update(exactLocationOfItemInDB, {
      3: itemCount,
    })
  })

  newItem.addEventListener('dblclick', function () {
    remove(exactLocationOfItemInDB)
  })


}