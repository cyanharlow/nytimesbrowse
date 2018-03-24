"use strict";

var loadedData;
var templateContent;

var numImgsLoaded = 0;
var totalImagesNeeded = 0;

document.body.addEventListener('ImagesLoaded', function (e) {
    var percentLoaded = numImgsLoaded / totalImagesNeeded * 100;
    document.getElementById('progress-bar').setAttribute('style', 'width: ' + percentLoaded + '%;');
    if (numImgsLoaded === totalImagesNeeded) {
        document.getElementById('page-container').innerHTML = templateContent;
    }
}, false);

function getWeeks(weeks) {
    if (weeks && weeks > 1) {
        return weeks + ' weeks on the list';
    }
    return 'New this week';
}

function getReview(review) {
    if (review) {
        return '<a class="review-link" href="' + review + '" target="_blank">Read Review</a>';
    }
    return '';
}

function getBuyOptions(buy) {
    var buyHTML = '<div class="buy"><div><a class="buy-button">Buy</a><div class="buy-options"><div class="arrow"><div class="innerarrow"></div></div>';
    for (var o = 0; o < buy.length; o++) {
        buyHTML += '<a href="' + buy[o].url + '" target="_blank">' + buy[o].name + '</a>';
    }
    buyHTML += '</div></div></div>';
    return buyHTML;
}

window.onhashchange = function() {
    document.getElementById('page-container').innerHTML = '<div class="loader">Loading best-sellers...<div class="loader-bar"><div id="progress-bar"></div></div></div>';
    window.scrollTo(0, 0);
    renderDynamicContent(loadedData, window.location.hash);
};

document.body.addEventListener("click", function(event) {
    if (event.target.className === 'buy-button') {
        event.target.parentElement.className = 'buy-showing';
    } else if (document.getElementsByClassName('buy-showing').length > 0) {
        for (var f = 0; f < document.getElementsByClassName('buy-showing').length; f++) {
            document.getElementsByClassName('buy-showing')[0].className = '';
        }
    }
});

function categoryChange() {
    var caturl = document.getElementById('category-change').value;
    window.location.hash = caturl;
};

function hasher(title) {
    if (title) {
        return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return false;
};

function renderStaticContent(data) {
    // these are the parts of the page that won't change after navigation/hash changes
    var menuChoices = data.results.lists;
    var year = data.results.published_date.substring(0, 4);
    var dayDate = Number(data.results.published_date.substring(8,10));
    var monthNum = Number(data.results.published_date.substring(5,7)) - 1;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var headerHTML = '<div class="header"><div class="page-width">' +
        '<svg class="nyt-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 185 26" enable-background="new 0 0 185 26" xml:space="preserve"> <path fill="#1A1A1A" d="M13.9,3.3c0-2-1.9-2.6-3.4-2.5v0.3c0.9,0,1.7,0.3,1.7,1c0,0.4-0.3,1-1.2,1c-0.7,0-2.2-0.4-3.3-0.8 C6.3,1.8,5.1,1.4,4.1,1.4c-2,0-3.4,1.5-3.4,3.3c0,1.5,1.1,2,1.6,2.2l0.1-0.2C2,6.4,1.7,6.2,1.7,5.6c0-0.4,0.4-1.1,1.4-1.1 c0.9,0,2.1,0.4,3.7,0.9c1.4,0.4,2.9,0.7,3.7,0.8v3.1L9,10.6v0.1l1.5,1.3v4.3c-0.8,0.5-1.7,0.6-2.5,0.6c-1.5,0-2.8-0.4-3.9-1.6l4.1-2 V6.5L3.1,8.7c0.5-1.3,1.6-2.2,2.7-2.9L5.7,5.6c-3,0.8-5.7,3.6-5.7,7c0,4.1,3.3,7.1,7.1,7.1c4.1,0,6.7-3.2,6.6-6.6l-0.2,0 c-0.6,1.3-1.5,2.5-2.6,3.2v-4.2l1.6-1.3l0-0.1l-1.6-1.3V6.2C12.3,6.2,13.9,5.2,13.9,3.3L13.9,3.3z M5.1,14.5L3.9,15 c-0.7-0.9-1.1-2.1-1.1-3.8c0-0.7,0.1-1.6,0.3-2.2l2.1-0.9L5.1,14.5L5.1,14.5z M15.8,16.7l-1.3,1l0.2,0.2l0.6-0.5l2.3,2.1l3-2 l-0.1-0.2l-0.8,0.5l-1-1V9.9l0.8-0.6l1.7,1.4v6.1c0,3.8-0.8,4.4-2.6,5.1v0.3c2.8,0.1,5.4-0.8,5.4-5.7V9.8l0.9-0.7l-0.2-0.2L24,9.5 l-2.5-2.1l-2.9,2.2V1.2h-0.2l-3.6,2.4v0.2c0.4,0.2,1,0.4,1,1.6V16.7L15.8,16.7z M34.2,15.6l-2.5,1.9l-2.6-2v-1.2l4.8-3.2V11 l-2.4-3.6l-5.2,2.8v6.6l-1,0.8l0.2,0.2l0.9-0.7l3.4,2.5l4.5-3.6L34.2,15.6L34.2,15.6z M29.2,13.9V9l0.2-0.1l2.2,3.5L29.2,13.9 L29.2,13.9z M53.4,2.4c0-0.3-0.1-0.6-0.2-0.9H53c-0.3,0.8-0.7,1.3-1.7,1.3c-0.9,0-1.5-0.5-1.9-0.9c0,0-2.9,3.3-2.9,3.3l0.2,0.2 l0.8-0.9c0.6,0.5,1.1,0.9,2.5,1v8.4L44.2,3.6c-0.5-0.8-1.2-1.9-2.6-1.9c-1.6,0-3,1.4-2.8,3.7H39c0.1-0.6,0.4-1.3,1.1-1.3 c0.6,0,1.1,0.5,1.3,1v3.3c-1.8,0-3,0.8-3,2.3c0,0.8,0.4,2.1,1.7,2.3l0-0.2c-0.2-0.2-0.3-0.4-0.3-0.7c0-0.6,0.4-0.9,1.1-0.9 c0.1,0,0.5,0,0.5,0v4.3c-2.1,0-3.8,1.2-3.8,3.2c0,1.9,1.7,2.8,3.4,2.7l0-0.2c-1.1-0.1-1.7-0.6-1.7-1.3c0-0.9,0.6-1.3,1.4-1.3 c0.8,0,1.5,0.5,2,1.1l2.9-3.2l-0.2-0.2L44.7,17c-1.1-1-1.7-1.3-3-1.5V5.4l8.1,14.1h0.6V5.4C52,5.3,53.4,4.2,53.4,2.4L53.4,2.4z M60.7,15.6l-2.5,1.9l-2.6-2v-1.2l4.8-3.2V11l-2.4-3.6l-5.2,2.8v6.6l-1,0.8l0.2,0.2l0.9-0.7l3.4,2.5l4.5-3.6L60.7,15.6L60.7,15.6z M55.7,13.9V9l0.2-0.1l2.2,3.5L55.7,13.9L55.7,13.9z M77.2,8.4L76.4,9l-1.9-1.6l-2.2,2l0.9,0.9v7.6l-2.4-1.6v-6.2l0.8-0.6l-2.3-2.2 l-2.2,2l0.9,0.9v7.2l-0.3,0.2l-2.1-1.5v-6.1c0-1.4-0.7-1.8-1.6-2.3c-0.7-0.5-1.1-0.8-1.1-1.5c0-0.6,0.6-0.9,0.9-1.1c0,0,0-0.2,0-0.2 c-0.8,0-2.9,0.8-2.9,2.8c0,1,0.5,1.4,1,1.9c0.5,0.5,1,0.9,1,1.8v5.8L61.6,18l0.2,0.2l1-0.8l2.7,2.1l2.5-1.7l2.8,1.7l5.3-3.1V9.6 l1.3-1L77.2,8.4L77.2,8.4z M95.8,2.9l-1,0.9l-2.3-2l-3.3,2.4V2h-0.3L89,18.3c-0.3,0-1.2-0.2-1.9-0.4L87,4.3c0-1-0.7-2.4-2.5-2.4 c-1.8,0-3,1.4-3,2.8h0.3c0.1-0.6,0.4-1.1,1-1.1c0.6,0,1.1,0.4,1.1,1.7v3.9C82,9.4,81,10.4,81,11.6c0,0.8,0.4,2,1.7,2.1l0-0.2 c-0.4-0.2-0.5-0.5-0.5-0.7c0-0.6,0.6-0.8,1.3-0.8h0.4v6.2c-1.5,0.5-2.1,1.6-2.1,2.8c0,1.7,1.3,2.9,3.3,2.9c1.4,0,2.6-0.2,3.9-0.5 c1-0.2,2.3-0.5,2.9-0.5c0.8,0,1.1,0.4,1.1,0.9c0,0.7-0.3,1-0.7,1.1l0,0.2c1.7-0.3,2.6-1.3,2.6-2.8c0-1.5-1.5-2.4-3.1-2.4 c-0.8,0-2.5,0.3-3.7,0.6c-1.4,0.3-2.8,0.5-3.2,0.5c-0.7,0-1.6-0.3-1.6-1.3c0-0.8,0.7-1.5,2.4-1.5c0.9,0,2,0.1,3.1,0.4 c1.2,0.3,2.3,0.6,3.4,0.6c1.5,0,2.8-0.5,2.8-2.7V4.1l1.2-1L95.8,2.9L95.8,2.9z M91.7,9.1c-0.3,0.3-0.7,0.6-1.2,0.6 c-0.6,0-1-0.3-1.2-0.6V4.6l1-0.7l1.4,1.3V9.1L91.7,9.1z M91.7,12.1c-0.2-0.2-0.7-0.5-1.2-0.5c-0.5,0-1,0.3-1.2,0.5V9.5 C89.5,9.7,90,10,90.5,10c0.5,0,1-0.3,1.2-0.5V12.1L91.7,12.1z M91.7,16.8c0,0.8-0.6,1.6-1.6,1.6c-0.2,0-0.6,0-0.8,0v-5.9 c0.2-0.2,0.7-0.6,1.2-0.6c0.5,0,0.9,0.3,1.2,0.6V16.8L91.7,16.8z M105.4,9.7l-3.3-2.3l-4.9,2.8v6.6l-1,0.8l0.1,0.2l0.8-0.6l3.2,2.4 l5-3V9.7L105.4,9.7z M100.1,16V8.8l2.5,1.8v7.2L100.1,16L100.1,16z M115,7.6c0,0-0.2,0-0.2,0c-0.3,0.2-0.6,0.4-0.9,0.4 c-0.4,0-0.9-0.2-1.1-0.5h-0.2l-1.7,1.9l-1.7-1.9l-3,2.1l0.1,0.2l0.8-0.5l1,1.1v6.3l-1.3,1l0.2,0.2l0.6-0.5l2.4,2.1l3.1-2.1l-0.1-0.2 l-0.9,0.5l-1.2-1.1V9.6c0.5,0.6,1.1,1,1.8,1C114.1,10.6,114.9,9.1,115,7.6L115,7.6z M127.1,17.3l-3.4,2.3l-4.6-7l3.3-5.1l0.2,0 c0.4,0.4,1.1,0.8,1.7,0.8c0.7,0,1.2-0.4,1.5-0.8c0,0,0.2,0,0.2,0c-0.1,2-1.5,3.2-2.5,3.2c-1.1,0-1.6-0.5-2.1-0.8l-0.3,0.5l5,7.4 l1-0.6L127.1,17.3L127.1,17.3z M116.1,16.7l-1.3,1l0.2,0.2l0.6-0.5l2.3,2.1l3-2l-0.2-0.2l-0.8,0.5l-1-1V1.2h-0.2L115,3.7v0.2 c0.4,0.2,1,0.3,1,1.5V16.7L116.1,16.7z M143.8,3.3c0-2-1.9-2.6-3.4-2.5v0.3c0.9,0,1.7,0.3,1.7,1c0,0.4-0.3,1-1.2,1 c-0.7,0-2.2-0.4-3.3-0.8c-1.3-0.4-2.5-0.8-3.5-0.8c-2,0-3.4,1.5-3.4,3.3c0,1.5,1.1,2,1.6,2.2l0.1-0.2c-0.3-0.2-0.6-0.4-0.6-1 c0-0.4,0.4-1.1,1.4-1.1c0.9,0,2.1,0.4,3.7,0.9c1.4,0.4,2.9,0.7,3.7,0.8v3.1l-1.5,1.3v0.1l1.5,1.3v4.3c-0.8,0.5-1.7,0.6-2.5,0.6 c-1.5,0-2.8-0.4-3.9-1.6l4.1-2V6.5l-5.1,2.3c0.5-1.3,1.6-2.2,2.7-2.9l-0.1-0.2c-3,0.8-5.7,3.6-5.7,7c0,4.1,3.3,7.1,7.1,7.1 c4.1,0,6.7-3.2,6.6-6.6l-0.2,0c-0.6,1.3-1.5,2.5-2.6,3.2v-4.2l1.6-1.3l0-0.1l-1.6-1.3V6.2C142.2,6.2,143.8,5.2,143.8,3.3L143.8,3.3z M135.1,14.5l-1.2,0.6c-0.7-0.9-1.1-2.1-1.1-3.8c0-0.7,0.1-1.6,0.3-2.2l2.1-0.9L135.1,14.5L135.1,14.5z M147.2,2.4l-0.1,0l-2,1.7 v0.1l1.7,1.9h0.2l2-1.7l0-0.1L147.2,2.4L147.2,2.4z M150.3,17.3l-0.8,0.5l-1-1V9.8l1-0.7l-0.2-0.2l-0.7,0.6l-1.7-2.1l-2.9,2l0.2,0.3 l0.7-0.5l0.9,1.1v6.5l-1.3,1l0.1,0.2l0.7-0.5l2.2,2l3-2L150.3,17.3L150.3,17.3z M167.1,17.1l-0.7,0.5l-1.1-1V9.8l1-0.8l-0.2-0.2 l-0.9,0.7L163,7.4l-3,2.1l-2.3-2.1l-2.9,2.1L153,7.4l-2.9,2l0.1,0.3l0.7-0.5l1,1.1v6.5l-0.8,0.8l2.3,1.9l2.2-2l-0.9-0.9V9.8l0.9-0.6 l1.6,1.4v6.1l-0.8,0.8l2.3,1.9l2.2-2l-0.9-0.9V9.8l0.8-0.5l1.7,1.4v6l-0.7,0.7l2.3,2.1l3.1-2.1L167.1,17.1L167.1,17.1z M175.8,15.6 l-2.5,1.9l-2.6-2v-1.2l4.8-3.2V11l-2.4-3.6l-5.2,2.8v6.8l3.5,2.5l4.5-3.6L175.8,15.6L175.8,15.6z M170.8,13.9V9l0.2-0.1l2.2,3.5 L170.8,13.9L170.8,13.9z M185,13l-1.9-1.5c1.3-1.1,1.8-2.6,1.8-3.7c0-0.1,0-0.4,0-0.6h-0.2c-0.2,0.5-0.6,1-1.4,1 c-0.8,0-1.3-0.4-1.8-1l-4.5,2.5v3.7l1.7,1.3c-1.7,1.5-2,2.6-2,3.3c0,1,0.5,1.7,1.3,2.1l0.1-0.2c-0.2-0.2-0.4-0.3-0.4-0.8 c0-0.3,0.4-0.8,1.2-0.8c1,0,1.6,0.7,1.9,1c0,0,4.4-2.6,4.4-2.6V13L185,13z M183.9,10c-0.7,1.2-2.2,2.4-3.1,3l-1.1-0.9V8.6 c0.4,1,1.5,1.8,2.6,1.8C183,10.4,183.4,10.3,183.9,10L183.9,10z M182.2,18c-0.5-1.1-1.7-1.9-2.9-1.9c-0.3,0-1.1,0-1.9,0.5 c0.5-0.8,1.8-2.2,3.5-3.2l1.2,1V18L182.2,18z"/> </svg>' +
        '<a href="#">' +
        '<h2>Books</h2>' +
        '<h1>The New York Times Best Sellers</h1></a>' +
        '<p>Authoritatively ranked lists of books sold in the United States, sorted by format and genre.</p></div></div>' +
        '<div class="menu-bar"><div class="page-width"><select class="menu-toggle" id="category-change" onchange="categoryChange()"><option selected disabled>See all categories</option>';
    for (var m = 0; m < menuChoices.length; m++) {
        headerHTML += '<option value="#category_' +
        menuChoices[m].list_name_encoded +
        '">' +
        menuChoices[m].list_name +
        '</option>';
    }
    headerHTML += '</select>';
    headerHTML += '<p class="published-date">' + months[monthNum] + ' ' + dayDate + ', ' + year + '</p><div class="clear"></div></div></div>';

    var footerHTML = '<div class="footer"><div class="page-width">' + data.copyright + '</div></div>';
    document.getElementById('header').innerHTML = headerHTML;
    document.getElementById('footer').innerHTML = footerHTML;
};

function renderDynamicContent(data, hash) {
    var activeCategory = false;
    var activeBook = false;
    if (hash) {
        var identifier = hash.replace('#', '').split('_')[0];
        if (identifier === 'category') {
            activeCategory = true;
        } else if (identifier === 'book') {
            activeBook = true;
        }
    }

    // reset our image loaded values, if hash has changed
    numImgsLoaded = 0;
    totalImagesNeeded = 0;

    // start page
    var html = '';
    var lists = data.results.lists;

    if (activeCategory) {
        // category view, list all books in this one category
        var categoryTitle = hash.split('_')[1];
        var activeList;
        for (var al = 0; al < lists.length; al++) {
            if (lists[al].list_name_encoded === categoryTitle) {
                activeList = lists[al];
                break;
            }
        }
        var catBooks = activeList.books;

        // breadcrumb
        html += '<div class="page-width"><div class="breadcrumb"><a href="#">All categories</a><span class="div">&gt;</span>' +
        activeList.list_name +
        '</a></div></div>';

        for (var c = 0; c < catBooks.length; c++) {
            // preload book images
            totalImagesNeeded++;
            var catBookImg = new Image();
            catBookImg.onload = function() {
                numImgsLoaded++;
                var catImagesLoaded = new CustomEvent('ImagesLoaded');
                document.body.dispatchEvent(catImagesLoaded);
            };
            catBookImg.src = catBooks[c].book_image;
            var arrowRank;
            if (catBooks[c].rank_last_week === 0 || catBooks[c].rank_last_week === catBooks[c].rank) {
                arrowRank = '';
            } else if (catBooks[c].rank_last_week < catBooks[c].rank) {
                arrowRank = '&darr;';
            } else {
                arrowRank = '&uarr;';
            }

            // build display column
            html += '<div class="book-row"><div class="page-width"><a href="' + '#book_' + activeList.list_id + '_' + catBooks[c].rank + '_' + hasher(catBooks[c].title) + '_' + hasher(catBooks[c].author) +
            '"><div class="rank"><span>' +
            catBooks[c].rank +
            '</span><span class="arrow-rank">' +
            arrowRank +
            '</span></div>' +
            '<img src="' +
            catBooks[c].book_image +
            '"><div class="book-content">' +
            '<p class="book-weeks">' +
            getWeeks(catBooks[c].weeks_on_list) +
            '</p><h3 class="book-title">' +
            catBooks[c].title +
            '</h3><h3 class="author">' +
            catBooks[c].author +
            '</h3><p>' +
            catBooks[c].description +
            '</p></a>'+
            getBuyOptions(catBooks[c].buy_links) +
            getReview(catBooks[c].book_review_link) +
            '</div><div class="clear"></div></div></div>';
        }
    } else if (activeBook) {
        // just show all details for one book
        var bookCategoryId = hash.split('_')[1];
        var bookCategoryTitle;
        var bookCategoryHash;
        var bookRank = hash.split('_')[2];
        // search first in categories
        var activeBookCategory;
        for (var ac = 0; ac < lists.length; ac++) {
            if (lists[ac].list_id.toString() === bookCategoryId) {
                activeBookCategory = lists[ac];
                bookCategoryTitle = lists[ac].list_name;
                bookCategoryHash = lists[ac].list_name_encoded;
                break;
            }
        }
        // then find the singular book details
        var singleBook;
        for (var ab = 0; ab < activeBookCategory.books.length; ab++) {
            if (activeBookCategory.books[ab].rank.toString() === bookRank) {
                singleBook = activeBookCategory.books[ab];
                break;
            }
        }
        // preload book image
        totalImagesNeeded++;
        var singleBookImg = new Image();
        singleBookImg.onload = function() {
            numImgsLoaded++;
            var singleBookImg = new CustomEvent('ImagesLoaded');
            document.body.dispatchEvent(singleBookImg);
        };
        singleBookImg.src = singleBook.book_image;

        // build display column
        html += '<div class="book-page"><div class="page-width">' +
        '<div class="breadcrumb"><a href="#">All categories</a><span class="div">&gt;</span><a href="#category_' +
        bookCategoryHash +
        '">' +
        bookCategoryTitle +
        '</a><span class="div">&gt;</span><span class="cap-title">' +
        singleBook.title.toLowerCase() +
        '</span></div>' +
        '<div class="book-content">' +
        '<p class="book-weeks">' +
        getWeeks(singleBook.weeks_on_list) +
        '</p><h1 class="book-title">' +
        singleBook.title +
        '</h1><h3 class="author">' +
        singleBook.author +
        '</h3>' +
        '<div class="rank"><span>#' +
        singleBook.rank +
        '</span> on the <strong>'+
        bookCategoryTitle +
        '</strong> list</span></div><p>' +
        singleBook.description +
        '</p>' +
        getBuyOptions(singleBook.buy_links) +
        getReview(singleBook.book_review_link) +
        '</div><img src="' +
        singleBook.book_image +
        '"><div class="clear"></div></div></div>';
    } else {
        // generic homepage view, limited to first five categories
        for (var l = 0; l < 5; l++) {
            html += '<div class="page-width"><h2 class="category-title">' +
            '<a href="#category_' +
            lists[l].list_name_encoded + '">' +
            lists[l].list_name +
            ' <span class="small"> &#8250;</span></a></h2><div class="list">';
                // list books of each category
                var books = lists[l].books;
                for (var b = 0; b < books.length; b++) {
                    // preload book image
                    totalImagesNeeded++;
                    var bookImg = new Image();
                    bookImg.onload = function() {
                        numImgsLoaded++;
                        var imagesLoaded = new CustomEvent('ImagesLoaded');
                        document.body.dispatchEvent(imagesLoaded);
                    };
                    bookImg.src = books[b].book_image;
                    // build display column
                    html += '<div class="book-column"><a href="#book_' +
                    lists[l].list_id + '_' + books[b].rank + '_' + hasher(books[b].title) + '_' + hasher(books[b].author) +
                    '"><div class="rank"><span>' +
                    books[b].rank +
                    '</span></div>' +
                    '<img src="' +
                    books[b].book_image +
                   '"><div class="book-content">' +
                    '<p class="book-weeks">' +
                    getWeeks(books[b].weeks_on_list) +
                    '</p><h3 class="book-title">' +
                    books[b].title +
                    '</h3><h3 class="author">' +
                    books[b].author +
                    '</h3><p>' +
                    books[b].description +
                    '</a>' +
                    getBuyOptions(books[b].buy_links) +
                    getReview(books[b].book_review_link) +
                    '</div><div class="clear"></div></div>';
                }
                html += '<div class="clear"></div>' +
                '</div></div>';
                // end of list
        }
    }

    html += '</div>';
    // end article content, set template value
    templateContent = html;
};

window.onload = function() {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://api.nytimes.com/svc/books/v3/lists/overview.jsonp?callback=foobar&api-key=957474c975634cc7a01a8a3ada453a94', true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText.replace('foobar(', '').replace('}]}]}]}});', '}]}]}]}}'));
            loadedData = data;
            renderDynamicContent(data, window.location.hash);
            renderStaticContent(data);
        }
    };
    request.send();
};

// IE event polyfill
(function () {
  if ( typeof window.CustomEvent === "function" ) return false; //If not IE

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
