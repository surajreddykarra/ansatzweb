document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const siteNav = document.getElementById("site-nav");
  const menuToggle = document.getElementById("menu-toggle");
  const navItems = document.getElementById("nav-items");

  if (menuToggle && navItems) {
    const closeMenu = () => {
      navItems.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = navItems.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navItems.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!navItems.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  const updateNavState = () => {
    if (!siteNav) {
      return;
    }
    siteNav.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  updateNavState();
  window.addEventListener("scroll", updateNavState, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  const revealElements = document.querySelectorAll(".reveal");
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const slides = Array.from(document.querySelectorAll("[data-slide]"));
  const prevButton = document.getElementById("carousel-prev");
  const nextButton = document.getElementById("carousel-next");
  const dotsContainer = document.getElementById("carousel-dots");
  const currentCount = document.getElementById("carousel-count-current");
  const totalCount = document.getElementById("carousel-count-total");
  const carouselControls = document.querySelector(".carousel-controls");

  if (slides.length && prevButton && nextButton && dotsContainer) {
    let activeIndex = 0;
    const dots = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Go to screenshot ${index + 1}`);
      dot.addEventListener("click", () => setActiveSlide(index));
      dotsContainer.appendChild(dot);
      return dot;
    });

    const setActiveSlide = (index) => {
      activeIndex = index;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle("is-active", isActive);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });

      if (currentCount) {
        currentCount.textContent = String(activeIndex + 1);
      }
      if (totalCount) {
        totalCount.textContent = String(slides.length);
      }
      prevButton.disabled = slides.length === 1;
      nextButton.disabled = slides.length === 1;
      if (carouselControls) {
        carouselControls.classList.toggle("is-single-slide", slides.length === 1);
      }
    };

    prevButton.addEventListener("click", () => {
      setActiveSlide((activeIndex - 1 + slides.length) % slides.length);
    });

    nextButton.addEventListener("click", () => {
      setActiveSlide((activeIndex + 1) % slides.length);
    });

    setActiveSlide(0);
  }

  if (!prefersReducedMotion) {
    const parallaxElements = document.querySelectorAll("[data-parallax]");
    const cursorGlow = document.querySelector(".cursor-glow");
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    let parallaxTicking = false;

    const updateParallax = () => {
      const scrollTop = window.scrollY;
      parallaxElements.forEach((element) => {
        const depth = Number(element.dataset.depth || "0");
        element.style.setProperty("--parallax-y", `${scrollTop * depth * -0.18}px`);
      });
      parallaxTicking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!parallaxTicking) {
          window.requestAnimationFrame(updateParallax);
          parallaxTicking = true;
        }
      },
      { passive: true }
    );
    updateParallax();

    if (cursorGlow && supportsFinePointer) {
      let pointerX = window.innerWidth / 2;
      let pointerY = window.innerHeight / 2;
      let currentX = pointerX;
      let currentY = pointerY;
      let cursorFrame = null;

      const interactiveSelectors =
        "a, button, .feature-card, .developer-card, .contact-box, .link-column, .carousel-slide img, .brand";

      const renderCursorGlow = () => {
        currentX += (pointerX - currentX) * 0.16;
        currentY += (pointerY - currentY) * 0.16;
        cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        cursorFrame = window.requestAnimationFrame(renderCursorGlow);
      };

      const showGlow = () => {
        cursorGlow.classList.add("is-active");
        if (!cursorFrame) {
          cursorFrame = window.requestAnimationFrame(renderCursorGlow);
        }
      };

      const hideGlow = () => {
        cursorGlow.classList.remove("is-active", "is-hovering");
        if (cursorFrame) {
          window.cancelAnimationFrame(cursorFrame);
          cursorFrame = null;
        }
      };

      window.addEventListener("mousemove", (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;

        if (!cursorFrame) {
          currentX = pointerX;
          currentY = pointerY;
          showGlow();
        }

        const interactiveTarget = event.target.closest(interactiveSelectors);
        cursorGlow.classList.toggle("is-hovering", Boolean(interactiveTarget));
      });

      window.addEventListener("mouseenter", showGlow);
      window.addEventListener("mouseleave", hideGlow);
      document.addEventListener("mouseleave", hideGlow);
    }
  }
});
