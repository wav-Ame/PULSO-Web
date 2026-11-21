
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ELEMENTOS GENERALES
    const header = document.querySelector(".header");
    const navigation = document.querySelector(".navigation");
    const menuToggle = document.querySelector("#menu-toggle");
    const navLinks = document.querySelectorAll(".nav-list a");
    const sections = document.querySelectorAll("main section[id]");

    // MENÚ MÓVIL
    const closeMobileMenu = () => {
        if (!navigation || !menuToggle) return;

        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
    };

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            navigation.classList.toggle("open", !isOpen);
            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Abrir menú" : "Cerrar menú"
            );
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", (event) => {
            const clickedInsideMenu = navigation.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMobileMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMobileMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 820) {
                closeMobileMenu();
            }
        });
    }

    // HEADER AL DESPLAZARSE
    const updateHeader = () => {
        if (!header) return;

        header.classList.toggle("scrolled", window.scrollY > 35);
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    // INDICADOR DE SECCIÓN ACTIVA
    if (
        "IntersectionObserver" in window &&
        sections.length &&
        navLinks.length
    ) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const currentId = entry.target.id;

                    navLinks.forEach((link) => {
                        const isActive =
                            link.getAttribute("href") === `#${currentId}`;

                        link.classList.toggle("active", isActive);

                        if (isActive) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                root: null,
                rootMargin: "-35% 0px -55% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    // ANIMACIONES DE ENTRADA
    const revealTargets = [
        ".section-heading",
        ".about-image",
        ".about-text",
        ".product-card",
        ".wellness-category",
        ".ally-card",
        ".professional-card",
        ".team-card",
        ".reservation-form",
        ".contact-information",
        ".contact-form",
        ".footer-content > div"
    ];

    const revealElements = document.querySelectorAll(
        revealTargets.join(", ")
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    } else if ("IntersectionObserver" in window) {
        revealElements.forEach((element) => {
            element.classList.add("reveal");
        });

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );
        revealElements.forEach((element, index) => {
            if (
                element.matches(
                    ".product-card, .ally-card, .professional-card, .team-card"
                )
            ) {
                const delay = (index % 4) * 85;
                element.style.transitionDelay = `${delay}ms`;
            }
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }

    // TARJETAS INTERACTIVAS DEL EQUIPO (EFECTO FLIP)
    const teamCards = document.querySelectorAll(".team-card");

    // Roles correspondientes a cada integrante.
    const teamRoles = {
        "Adrián Jimenez": "Mesero y relacionista público",
        "Adrián Jiménez": "Mesero y relacionista público",
        "Gabriel Morales": "Mesero",
        "Nicolás Castillo": "Recepcionista",
        "Eduardo Guzmán": "Mesero y animador",
        "Leonardo Salgado": "Barman",
        "Santiago Mendez": "BTL y mesero",
        "Santiago Méndez": "BTL y mesero",
        "Alejandro Untuña": "Mesero",
        "Valeria Rodríguez": "Manager y mesera",
        "Emilia Rosío": "Recepcionista",
        "Victoria Hayes": "Animadora e impulsadora",
        "Isabela Cobos": "Bartender",
        "Renata Verdezoto": "Mesera y marketing"
    };

    teamCards.forEach((card) => {

        const heading = card.querySelector("h3");

        if (!heading) return;

        const name = heading.textContent.trim();
        const role = teamRoles[name];

        if (!role) return;

        // Evitar duplicar el contenido.
        if (card.querySelector(".team-card-inner")) return;

        // Contenedor de las dos caras.
        const inner = document.createElement("div");
        inner.className = "team-card-inner";

        // Cara frontal: nombre.
        const front = document.createElement("div");
        front.className = "team-card-front";

        // Cara posterior: cargo.
        const back = document.createElement("div");
        back.className = "team-card-back";

        const roleText = document.createElement("p");
        roleText.textContent = role;

        front.appendChild(heading);
        back.appendChild(roleText);

        inner.append(front, back);

        // Incorporar las caras a la tarjeta.
        card.replaceChildren(inner);

        card.classList.add("team-card--flip");

        // Accesibilidad.
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-pressed", "false");
        card.setAttribute(
            "aria-label",
            `${name}. ${role}. Pulsa para girar la tarjeta.`
        );

        // Alternar entre frontal y reverso.
        const toggleCard = () => {
            const isFlipped = card.classList.toggle("is-flipped");

            card.setAttribute(
                "aria-pressed",
                String(isFlipped)
            );
        };

        // Interacción táctil y con mouse.
        card.addEventListener("click", toggleCard);

        // Compatibilidad con teclado.
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleCard();
            }
        });

    });


    // FILTROS DEL CATÁLOGO
    const categoryButtons = document.querySelectorAll(".category-button");
    const productCards = document.querySelectorAll(".product-card");
    if (categoryButtons.length && productCards.length) {
        categoryButtons.forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                String(button.classList.contains("active"))
            );
            button.addEventListener("click", () => {
                const selectedCategory = button.dataset.category;
                categoryButtons.forEach((categoryButton) => {
                    const isActive = categoryButton === button;
                    categoryButton.classList.toggle("active", isActive);
                    categoryButton.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );
                });
                productCards.forEach((card) => {
                    const matchesCategory =
                        selectedCategory === "all" ||
                        card.dataset.category === selectedCategory;
                    card.hidden = !matchesCategory;
                });
            });
        });
    }

    // FECHA Y HORA DE RESERVACIÓN
    const reservationDate = document.querySelector("#reservation-date");
    const reservationTime = document.querySelector("#reservation-time");
    const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };
    if (reservationDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        reservationDate.min = getLocalDateString(tomorrow);
    }
    if (reservationTime) {
        reservationTime.min = "18:00";
        reservationTime.max = "23:59";
    }

    // FORMULARIO DE RESERVACIÓN
    const reservationForm = document.querySelector("#reservation-form");
    const reservationStatus = document.querySelector(
        "#reservation-message-status"
    );
    if (reservationForm && reservationStatus) {
        reservationForm.addEventListener("submit", (event) => {
            event.preventDefault();
            reservationStatus.textContent = "";
            if (!reservationForm.checkValidity()) {
                reservationForm.reportValidity();
                return;
            }
            const formData = new FormData(reservationForm);

            const phone = String(
                formData.get("customerPhone") || ""
            ).trim();
            const guests = Number(formData.get("guests"));

            const selectedDate = String(
                formData.get("reservationDate") || ""
            );
            const selectedTime = String(
                formData.get("reservationTime") || ""
            );
            const phoneIsValid = /^[+\d\s()-]{7,20}$/.test(phone);
            if (!phoneIsValid) {
                reservationStatus.textContent =
                    "Revisa el número telefónico. Introduce un número válido.";
                return;
            }
            if (!Number.isInteger(guests) || guests < 1 || guests > 12) {
                reservationStatus.textContent =
                    "El número de personas debe estar entre 1 y 12.";
                return;
            }
            if (selectedDate <= getLocalDateString(new Date())) {
                reservationStatus.textContent =
                    "Selecciona una fecha posterior al día de hoy.";
                return;
            }
            if (selectedTime < "18:00" || selectedTime > "23:59") {
                reservationStatus.textContent =
                    "El horario para solicitar reservaciones es de 18:00 a 23:59.";
                return;
            }
            reservationStatus.textContent =
                "Validación completada. Esta es una demostración: tu solicitud no se ha enviado. Para recibir reservas, primero debemos conectar el sistema a un backend.";
            reservationStatus.setAttribute("role", "status");
        });
    }

    // FORMULARIO DE CONTACTO
    const contactForm = document.querySelector("#contact-form");
    const contactStatus = document.querySelector("#contact-status");
    if (contactForm && contactStatus) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            contactStatus.textContent = "";

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            contactStatus.textContent =
                "Formulario validado correctamente. Esta es una demostración: el mensaje no se ha enviado porque todavía no hay un servicio de recepción conectado.";

            contactStatus.setAttribute("role", "status");
        });
    }

    // AÑO AUTOMÁTICO DEL FOOTER
    const footerCopyright = document.querySelector(".footer-bottom p");
    if (footerCopyright) {
        footerCopyright.textContent = footerCopyright.textContent.replace(
            /©\s*\d{4}/,
            `© ${new Date().getFullYear()}`
        );
    }

});