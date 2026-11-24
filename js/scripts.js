// This code will toggle the class 'show-menu' on the body tag
// when an element (usually a <button>) with the class 'js-menu-trigger' is clicked
//
// In your HTML:
// <button class="js-menu-trigger">Toggle</button>

document.addEventListener('DOMContentLoaded', function() {
  var menuTrigger = document.querySelector('.js-menu-trigger');
  var objectGalleryList = document.querySelector('.object-gallery ol');
  var objectEntries = document.querySelectorAll('.object-entry');
  var desktopQuery = window.matchMedia('(min-width: 850px)');

  if (menuTrigger) {
    menuTrigger.addEventListener('click', function() {
      document.body.classList.toggle('show-menu');
    });
  }

  if (objectGalleryList) {
    var originalItems = Array.from(objectGalleryList.children);

    originalItems.slice().reverse().forEach(function(item) {
      var clone = item.cloneNode(true);
      var cloneLink = clone.querySelector('a');

      clone.setAttribute('aria-hidden', 'true');

      if (cloneLink) {
        cloneLink.setAttribute('tabindex', '-1');
      }

      objectGalleryList.prepend(clone);
    });

    var setGallerySpeed = function() {
      var originalWidth = objectGalleryList.scrollWidth / 2;
      var seconds = Math.max(originalWidth / 18, 45);

      objectGalleryList.style.setProperty('--object-gallery-duration', seconds + 's');
    };

    setGallerySpeed();
    window.addEventListener('load', setGallerySpeed);
    window.addEventListener('resize', setGallerySpeed);
  }

  objectEntries.forEach(function(entry) {
    var media = entry.querySelector('.object-entry_media');

    if (!media) {
      return;
    }

    var syncMediaState = function() {
      if (desktopQuery.matches) {
        media.setAttribute('role', 'button');
        media.setAttribute('tabindex', '0');
        media.setAttribute('aria-expanded', entry.classList.contains('object-entry--open'));
      } else {
        entry.classList.remove('object-entry--open');
        media.removeAttribute('role');
        media.removeAttribute('tabindex');
        media.removeAttribute('aria-expanded');
      }
    };

    var toggleEntry = function() {
      if (!desktopQuery.matches) {
        return;
      }

      var isOpen = entry.classList.toggle('object-entry--open');
      media.setAttribute('aria-expanded', isOpen);
    };

    media.addEventListener('click', toggleEntry);
    media.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleEntry();
      }
    });
    desktopQuery.addEventListener('change', syncMediaState);
    syncMediaState();
  });
});