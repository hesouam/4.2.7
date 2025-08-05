const boxInput = document.querySelector('.box__input');
const dropdown = document.querySelector('.dropdown');
const boxItems = document.querySelector('.box__items');

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};

function createBoxItem(item) {
    const boxItem = document.createElement('div');
    boxItem.classList.add('box__item');

    const nameParagraph = document.createElement('p');
    nameParagraph.classList.add('box__item-text');
    nameParagraph.textContent = `Name: ${item.name}`;

    const ownerParagraph = document.createElement('p');
    ownerParagraph.classList.add('box__item-text');
    ownerParagraph.textContent = `Owner: ${item.owner.login}`;

    const starsParagraph = document.createElement('p');
    starsParagraph.classList.add('box__item-text');
    starsParagraph.textContent = `Stars: ${item.stargazers_count}`;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delBtn');

    deleteButton.addEventListener('click', () => {
        boxItems.removeChild(boxItem);
        if (boxItems.children.length === 0) {
            boxItems.style.display = 'none';
        }
    });

    boxItem.append(nameParagraph, ownerParagraph, starsParagraph, deleteButton);
    return boxItem;
}

function createDropdownItem(item) {
    const dropdownItem = document.createElement('div');
    dropdownItem.classList.add('dropdown__item');
    dropdownItem.textContent = item.name;

    dropdownItem.addEventListener('click', () => {  
        const boxItem = createBoxItem(item);
        boxItems.style.display = 'block';
        boxItems.append(boxItem);
        boxInput.value = '';
        dropdown.style.display = 'none';
    });

    return dropdownItem;
}

function fetchData(query) {
    if (query.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Unable to fetch');
        }
    })
    .then((data) => {
        dropdown.innerHTML = '';

        data.items.forEach((item) => {
            const dropdownItem = createDropdownItem(item);
            dropdown.append(dropdownItem);
        });

        dropdown.style.display = 'block';
    })
    .catch((err) => {
        console.error(err.message);
        dropdown.style.display = 'none';
    });
}

boxInput.addEventListener(
    'input',
    debounce(() => {
        const query = boxInput.value.trim();
        fetchData(query);
    }, 500)
);

function handleOutsideClick(event) {
    if (!boxInput.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
}

document.addEventListener('click', handleOutsideClick);