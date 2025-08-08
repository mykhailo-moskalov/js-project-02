import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const categories = document.querySelector(".categories");
const furnitureList = document.querySelector(".furniture-list");
const loader = document.querySelector(".loader")
const loadMoreBtn = document.querySelector(".show-more-btn")
const allCategoriesBtn = document.querySelector(".all-category");
let query = "";
let page = 1;
let totalCounter;
loadMoreBtn.addEventListener("click", handleLoadMore);
 
const categoriesList = [];

categories.addEventListener("click", handleClick);

getCategoriesByQuery().then(data => {
    createCategories(data)
    
})

getAllItemsByQuery(page).then(data => {
    totalCounter = data.totalItems
                totalCounter -= data.furnitures.length
                createFurnitureList(data.furnitures)
                hideLoader();
                showLoadMore();
                
})


async function getCategoriesByQuery() {
    const response = await axios.get('https://furniture-store.b.goit.study/api/categories') 
    return response.data 
}

function createCategories(arr) {
    categories.insertAdjacentHTML("beforeend", arr.map(({ name, _id }) => {
       return `<li class="categories-item" ><button class="categories-btn" id="${_id}">${name}</button></li>`
    }).join(""))
    arr.forEach(({ _id }) => {
        categoriesList.push(_id)
    })

    const buttons = document.querySelectorAll(".categories-btn");
    buttons.forEach(btn => {
    switch (btn.textContent.trim()) {
      case "М'які меблі":
            btn.classList.add("soft-category")
        break;
      case "Шафи та системи зберігання":
        btn.classList.add("storage-category")
            break;
      case "Ліжка та матраци":
        btn.classList.add("beds-category")
            break;
        case "Столи":
        btn.classList.add("tabels-category")
            break;
        case "Стільці та табурети":
        btn.classList.add("chairs-category")
            break;
        case "Кухні":
        btn.classList.add("kitchens-category")
            break;
        case "Меблі для дитячої":
        btn.classList.add("nursery-category")
            break;
        case "Меблі для офісу":
        btn.classList.add("office-category")
            break;
        case "Меблі для передпокою":
        btn.classList.add("hallway-category")
            break;
        case "Меблі для ванної кімнати":
        btn.classList.add("bathroom-category")
            break;
        case "Садові та вуличні меблі":
        btn.classList.add("garden-category")
            break;
        case "Декор та аксесуари":
        btn.classList.add("decor-category")
            break;
      default:
        btn.classList.add("category")
    }
    
  });

}

async function getItemsByQuery(category, page) {
    const response = await axios.get('https://furniture-store.b.goit.study/api/furnitures', {
        params: {
            category,
            page,
            limit: 8
        }
    }) 
    return response.data
}

async function getAllItemsByQuery(page) {
    const response = await axios.get('https://furniture-store.b.goit.study/api/furnitures', {
        params: {
            limit: 8,
            page
        }
    })
    return response.data
}

async function handleClick(event) {
    event.preventDefault();
    clearFurnitureList()
    page = 1;
    showLoader();
    hideLoadMore();
    if (event.target.classList.contains('categories-btn')) {
    document.querySelectorAll('.categories-btn.accent').forEach(btn => {
      btn.classList.remove('accent');
    });
    event.target.classList.add('accent');
  }

    if (event.target !== event.currentTarget) {
        if (event.target.id === "all-categories") {
            try {
                const response = await getAllItemsByQuery(page);
                totalCounter = response.totalItems;
                totalCounter -= response.furnitures.length
                createFurnitureList(response.furnitures)
                hideLoader();
                showLoadMore();
            } catch (error) {
                iziToast.show({
                message: error.message,
                 messageColor: 'white',
                backgroundColor: 'red',
                maxWidth: "432px",
                close: true,
                position: "topRight",
        })
            }
        } else {
            query = event.target.id;  

            try {
                const response = await getItemsByQuery(event.target.id, page);
                totalCounter = response.totalItems;
                totalCounter -= response.furnitures.length
                createFurnitureList(response.furnitures)
                hideLoader();
                showLoadMore();
                if (!totalCounter) {
                hideLoadMore();
                }
            } catch (error) {
                iziToast.show({
                message: error.message,
                 messageColor: 'white',
                backgroundColor: 'red',
                maxWidth: "432px",
                close: true,
                position: "topRight",
        })
            }
        }
        
    }
    
}

function createFurnitureList(arr) {
    furnitureList.insertAdjacentHTML("beforeend", arr.map(({ images, name, price, _id, color, description}) => {
        return `<li class="furniture-list-item">
        <img class="furniture-item-img" src="${images[0]}" alt="${description}">
        <h4 class="furniture-item-name">${name}</h4>
        <div class="furniture-colors">
        ${color.map(item => `<span class="item-color" style="background-color: ${item};"></span>`).join('')}
        </div>
        <p class="furniture-item-price">${price} грн</p>
        <button class="furniture-details-btn" id="${_id}">Детальніше</button>
        </li>`
    }).join(""))
}

function showLoadMore() {
    loadMoreBtn.classList.remove("visually-hidden");
}

function hideLoadMore() {
    loadMoreBtn.classList.add("visually-hidden");
}

function showLoader() {
    loader.classList.remove("visually-hidden");
}

function hideLoader() {
    loader.classList.add("visually-hidden");
}

function clearFurnitureList() {
    furnitureList.innerHTML = "";
}

async function handleLoadMore(event) {
    hideLoadMore();
    showLoader();
    page++;
    loadMoreBtn.blur();
    if (allCategoriesBtn.classList.contains("accent")) {
        try {
            const response = await getAllItemsByQuery(page);
            createFurnitureList(response.furnitures );
            hideLoader();
            showLoadMore();
            totalCounter -= response.furnitures.length
            if (!totalCounter) {
                hideLoadMore();
            }

    } catch(error) {
        iziToast.show({
                message: error.message,
                 messageColor: 'white',
                backgroundColor: 'red',
                maxWidth: "432px",
                close: true,
                position: "topRight",
        })
        
    }
    } else {

        try {
            const response = await getItemsByQuery(query, page);
            createFurnitureList(response.furnitures );
            hideLoader();
            showLoadMore();
            totalCounter -= response.furnitures.length
            if (!totalCounter) {
                hideLoadMore();
            }

    } catch(error) {
        iziToast.show({
                message: error.message,
                 messageColor: 'white',
                backgroundColor: 'red',
                maxWidth: "432px",
                close: true,
                position: "topRight",
        }) 
    }
    } 
}