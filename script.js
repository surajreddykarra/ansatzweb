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
      const showGlow = () => {
        cursorGlow.style.opacity = "1";
      };

      const hideGlow = () => {
        cursorGlow.style.opacity = "0";
      };

      window.addEventListener("mousemove", (event) => {
        cursorGlow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      });
      window.addEventListener("mouseenter", showGlow);
      window.addEventListener("mouseleave", hideGlow);
    }
  }
});
