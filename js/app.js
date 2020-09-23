/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
*/
const body = document.body;
const sections = document.querySelectorAll('section');
const navList = document.getElementById('navbar__list');
const menu = document.querySelector('.navbar__menu');
const pageHeader = document.querySelector('.page__header');
const toTopBtn = document.getElementById('toTop');
const toggleMenuBtn = document.getElementById('toggleMenu');
const logo = document.getElementById('logo');
const Links = document.querySelectorAll('a');
const submitBtn = document.getElementById('submit');
let hideScroll;

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/
    const sectionTrack = section => {

    // Get the offset Top of the section
    let sectionTop = section.offsetTop;

    // get the height of section
    const sectionHeight = section.getBoundingClientRect().height;

    // detect the target points
    let startPoint = sectionTop - 105; // when scroll to contact section on smaller screen i found that window.scrollY is lesser than contact offsetTop
                                      //  so i substract 105 from offsetTop to make window.scrollY greater than offsetTop 
                                     //    ** maybe it's not the optimum solution (: but it works **  
    let endPoint = startPoint + sectionHeight;

    return { startPoint, endPoint };

    }
    const fixedNavOnScroll = _ => {
        // get the height of the page header
        const headerHeight = pageHeader.getBoundingClientRect().height;

        // Detect media query
        const mq = window.matchMedia("(max-width: 50em)")

        if(!mq.matches) {
             // if the scroll pass the page header height the class will added or removed 
            window.scrollY > headerHeight ? pageHeader.classList.add('fixed-nav'): pageHeader.classList.remove('fixed-nav');
        }
    }
    const activeSectionOnScroll = _ => {
        sections.forEach(element => {
            
            // Get the beginning and the end points of section
            let section = sectionTrack(element);

            // if the scroll is larger than sectionTop , add active-section and if it lesser than sectionTop 
            //  remove the class active-section
            if(window.scrollY > section.startPoint && window.scrollY <= section.endPoint) {
                if(!element.children[1].classList.contains('section__hide')) element.classList.add('active-section')
            } else {
                element.classList.remove('active-section')
            }
        })
    }
    const activeLinkOnScroll = _ => {
        const menuLink = document.querySelectorAll('.menu__link');
        menuLink.forEach(item => {
            // get the href attribute value
            let itemAttr = item.getAttribute('href');
            // slice the hash(#) from the href value
            let sectionId = itemAttr.slice(1,itemAttr.length);

            // use sliced href value as point to get the selected section
            let element = document.getElementById(sectionId)

            // Get the beginning and the end points of section
            let section = sectionTrack(element);

            // if the scroll is larger than sectionTop , add active-section and if it lesser than sectionTop 
            //  remove the class active-section
            window.scrollY > section.startPoint && window.scrollY <= section.endPoint? item.classList.add('active-link'):item.classList.remove('active-link')
        })

    }
    const scrollToAnchor = event => {
        // Prevent the anchor element from jumbing to the section
        event.preventDefault();

        // get the anchor element
        let link = event.target;

        // get the href value
        let linkHref = link.getAttribute('href');

        // remove the hash (#) from href value
        let sectionId = linkHref.slice(1, linkHref.length);

        // get the offset top of the targeted section
        let element = document.getElementById(sectionId);

        let section = sectionTrack(element)

        // scroll smoothly to the targeted element
        window.scrollTo({
            top:section.startPoint + 10,
            behavior:'smooth'
        });
    }
    const toggleTopButton = _ => {
        let headerHeight = pageHeader.getBoundingClientRect().height;
        if(window.scrollY > headerHeight) toTopBtn.style.display = 'flex';
        else toTopBtn.style.display = 'none'
    }
    const scrollToTop = _ => {
        window.scrollTo({
            top:0,
            behavior:'smooth'
        })
    }
    const toggleMenu = event => {
        let btn = event.target.parentNode
        menu.classList.toggle('toggle__menu');
        if(menu.classList.contains('toggle__menu')) {
            btn.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i>`
        } else {
            btn.innerHTML = `<i class="fa fa-bars" aria-hidden="true"></i>`
        }
    }
    const changeLogoOnScroll = _ => {
        // get the height of the page header
        const headerHeight = pageHeader.getBoundingClientRect().height;

        // Detect media query
        const mq = window.matchMedia("(max-width: 50em)")

        // Apply this media query only if it matches
        if (mq.matches) {
             // if the scroll pass the page header height the class will added or removed 
            window.scrollY > headerHeight ? logo.setAttribute('src','assets/logo-alt.png'): logo.setAttribute('src','assets/logo.png');
        }
    }
    const hideScrollBar = _ => {
        // Clear the previous Timeout
        window.clearTimeout(hideScroll)

        // set timeout to hide scroll on inactivity
        hideScroll = setTimeout( _ => {
            body.style.overflow = 'hidden'
        },2000)
    }
    const showScrollBar = event => {
        body.style.overflow = '';
        if(event.keyCode === 38 || event.keyCode === 40){
            body.style.overflow = '';
        }
    }
    const createCollapseBtn = _ => {
        
        sections.forEach(section => {
            // Create new div
            const cBtn = document.createElement("div");

            // Add Class (section__collapse)
            cBtn.classList.add('section__collapse');

            // set info when hover on it
            cBtn.setAttribute('title','Collapse section');

            // add id (toggleSection)
            cBtn.id = 'toggleSection';

            // add minus fontawesome icon
            cBtn.innerHTML = `<i class="fas fa-minus-square"></i>`

            // insert the button in the section before others elements
            section.insertAdjacentElement("afterbegin", cBtn);
        })
    }
    const toggleSection = event => {
        // get the collapse div
        const element = event.target.parentNode
        // get the sibling (landing__container) of this div
        const section = element.nextElementSibling;
        // Show / Hide the section by adding and remove Class (section__hide)
        section.classList.toggle('section__hide')        
        // check if the section has Class (section__hide) or not
        // Get the beginning and the end points of section
        let CheckOffset = sectionTrack(element.parentNode);
        if(section.classList.contains('section__hide')) {
            // if section doesn't has this class the icon will be plus symbol
            element.innerHTML = `<i class="fas fa-plus-square"></i>`
            // and the title attribute will be (open section)
            element.setAttribute('title','Open section');
            // Remove Class (active-section) when section collapesed
            element.parentNode.classList.remove('active-section')
        }else{
            // if section has this class the icon will be minus symbol
            element.innerHTML = `<i class="fas fa-minus-square"></i>`
            // and the title attribute will be (Collapse section)
            element.setAttribute('title','Collapse section')
            // Add Class (active-section) when section opened if the section near top of viewport
            if(window.scrollY > CheckOffset.startPoint && window.scrollY <= CheckOffset.endPoint) {
                // Add Class (active-section) when section opened
                element.parentNode.classList.add('active-section')
            }
        }
    }

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/
window.addEventListener('DOMContentLoaded', _ => {
    // build the nav
   
        // 1.Create an Array to store the data-nav name from sections
        let sectionNames = [];

        // 2. Loop through all section to get the data nav and push into sectionNames Array 
        sections.forEach(e => {
            sectionNames.push(e.dataset.nav)
        })
        
        // 3. Loop through sectionNames to create html navbar template as string and store in variable
        //    and insert this varibale inside ul by using innerHTML 
        const navItems = sectionNames.map(name => {
            let htmlTemp = `<li><a href="#${name}" class="menu__link">${name}</a></li>`;
            return htmlTemp;
        }).join(" ")

        // 5. Append  to navList (ul)
        navList.innerHTML = navItems;
    
    // Prevent Anchors from their default action
    Links.forEach(link => {
        link.addEventListener('click', e => { e.preventDefault() })
    })

    // Prevent Submit Button from its default action
    submitBtn.addEventListener('click', e => { e.preventDefault() })
    
    // Toggle Menu (media query)
    toggleMenuBtn.addEventListener('click',toggleMenu)

    // Hide Scrollbar when user not scroll
    hideScrollBar();

    window.addEventListener('scroll', _ => {

        // Add Class 'fixed-nav' to the navigation when start to scroll
        fixedNavOnScroll();

        // Add class 'active-section' to section when near top of viewport
        activeSectionOnScroll();

        // Add Class 'Active-link' on the link of section near top of viewport
        activeLinkOnScroll();

        // Toggle (scroll to top) button
        toggleTopButton();

        // Change Logo theme on Scroll
        changeLogoOnScroll();

        // Toggle Scroll Bar
        hideScrollBar();
    })

    // Scroll to anchor ID using scrollTO event
    navList.addEventListener('click', scrollToAnchor)

    // scroll to the top
    toTopBtn.addEventListener('click',scrollToTop)

    // show scroll bar based on event trigger 
    body.addEventListener('click', showScrollBar)
    body.addEventListener('mousemove', showScrollBar)
    body.addEventListener('mousewheel', showScrollBar)
    document.addEventListener('keydown',showScrollBar)
    document.addEventListener('touchstart',showScrollBar)

    // // Hide scroll bar on inactivity after click or mouse move
    body.addEventListener('click', hideScrollBar)
    body.addEventListener('mousemove', hideScrollBar)
 
    // Create Collapse Button for all section
    createCollapseBtn();

    // show / hide sections by clicking on collapse button (event delegation)
    sections.forEach(section => {
        section.addEventListener('click',toggleSection)
    })
    
});




/**
 * End Main Functions
 * Begin Events
 * 
*/

// Build menu 

// Scroll to section on link click

// Set sections as active


