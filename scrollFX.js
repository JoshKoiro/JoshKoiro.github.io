// Create a function that adds a CSS class to an element
function addClass(element, className) {
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ' ' + className;
    }
  }
  
  // Create a function that removes a CSS class from an element
  function removeClass(element, className) {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(
        new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' '
      );
    }
  }
  
  // Create an Intersection Observer instance
  var observer = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add animation class when element enters the viewport
          addClass(entry.target, entry.target.dataset.animationClass);
        } else {
          // Remove animation class when element exits the viewport
          removeClass(entry.target, entry.target.dataset.animationClass);
        }
      });
    },
    { threshold: 0.2 } // Adjust the threshold value as needed
  );
  
  // Select all elements with the specified class
  var animatedElements = document.querySelectorAll('.animated');
  
  // Iterate over each animated element and observe it
  animatedElements.forEach(function (element) {
    // Get the animation class from the element's data attribute
    var animationClass = element.dataset.animationClass;
  
    // If a class is specified, observe the element
    if (animationClass) {
      // Set the initial state of the element
      removeClass(element, animationClass);
  
      // Set the animation class as a data attribute for future reference
      element.dataset.animationClass = animationClass;
  
      // Start observing the element
      observer.observe(element);
    }
  });
  