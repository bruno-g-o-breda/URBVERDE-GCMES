<!-- URBVERDE-GCMES/src/components/navbar/NavbarHomepage.vue -->
<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <LogoRouterLink />

        <!-- Botão para collapse (responsivo para telas menores) -->
        <button
          class="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          @click.prevent="toggleNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <router-link to="/sobre" class="router">
              <li class="nav-item d-flex" :class="{ 'nav-item-active': activeItem === 'sobre' }">
                <a href="#" class="body-small-regular">Quem Somos</a>
              </li>
            </router-link>
            <router-link to="/parceiro" class="router">
              <li class="nav-item d-flex" :class="{ 'nav-item-active': activeItem === 'parceiro' }">
                <a href="#" class="body-small-regular">Seja Parceiro</a>
              </li>
            </router-link>
            <router-link to="/contato" class="router">
              <li class="nav-item d-flex" :class="{ 'nav-item-active': activeItem === 'contato' }">
                <a href="#" class="body-small-regular">Contatos</a>
              </li>
            </router-link>
            <li class="nav-item d-flex">
              <a
                href="https://urbverde-educa.tawk.help/"
                target="_blank"
                rel="noopener noreferrer"
                class="body-small-regular"
              >
                UrbVerde Educa
              </a>
            </li>
          </ul>

          <router-link to="/mapa" class="button-primary-link" aria-label="Acessar a plataforma da UrbVerde">
            <PrimaryButton
              label="Acessar a plataforma"
              :filled="true"
              iconType="bootstrap"
              icon="bi bi-arrow-right"
              iconPosition="right"
            />
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import LogoRouterLink from '@/components/logo_router_link/LogoRouterLink.vue';

export default {
  name: 'NavbarHomepage',
  components: {
    PrimaryButton,
    LogoRouterLink,
  },

  props: {
    activeItem: {
      type: String,
      default: '',
      validator(value) {
        return ['', 'sobre', 'parceiro', 'contato'].includes(value);
      }
    }
  },

  methods: {
    toggleNavbar() {
      const collapseElement = document.getElementById('navbarNav');

      if (collapseElement.classList.contains('show')) {
        collapseElement.classList.add('collapsing');
        const height = collapseElement.offsetHeight;
        collapseElement.style.height = `${height  }px`;
        collapseElement.offsetHeight;
        collapseElement.style.height = '0';
        collapseElement.classList.remove('show');
        event.currentTarget.setAttribute('aria-expanded', 'false');

        setTimeout(() => {
          collapseElement.classList.remove('collapsing');
          collapseElement.style.height = '';
        }, 300);
      } else {

        collapseElement.classList.add('collapsing');
        collapseElement.style.height = '0';
        collapseElement.offsetHeight;
        collapseElement.classList.add('show');
        const height = collapseElement.scrollHeight;
        collapseElement.style.height = `${height  }px`;
        event.currentTarget.setAttribute('aria-expanded', 'true');

        setTimeout(() => {
          collapseElement.classList.remove('collapsing');
          collapseElement.style.height = '';
        }, 300);
      }
    },

    handleOutsideClick(event) {
      const collapseElement = document.getElementById('navbarNav');
      const togglerElement = document.querySelector('.navbar-toggler');

      // Verifica se o clique foi fora do menu e do botão
      if (
        collapseElement &&
        togglerElement &&
        !collapseElement.contains(event.target) &&
        !togglerElement.contains(event.target)
      ) {
        // Fecha o menu se estiver aberto
        if (collapseElement.classList.contains('show')) {
          collapseElement.classList.add('collapsing');

          const height = collapseElement.offsetHeight;
          collapseElement.style.height = `${height  }px`;

          collapseElement.offsetHeight;
          collapseElement.style.height = '0';

          collapseElement.classList.remove('show');
          togglerElement.setAttribute('aria-expanded', 'false');

          setTimeout(() => {
            collapseElement.classList.remove('collapsing');
            collapseElement.style.height = '';
          }, 300);
        }
      }
    },
  },

  mounted() {
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
};
</script>

<style scoped lang="scss">
  @import '@/assets/styles/breakpoints.scss';

  .router{
    text-decoration: none;
  }

  .navbar {
    padding: 0;
    min-height: 72px;
    padding: 16px 128px;
    position: relative;
    z-index: 2;
  }

  .navbar .navbar-toggler {
    border: transparent;
  }

  .navbar .navbar-toggler.collapsed {
    border: transparent;
  }

  .navbar .navbar-toggler-icon {
    font-size: 16px;
    color: var(--bs-green-500)
  }

  .navbar .navbar-nav {
    margin: auto;
    padding: 0 12px;
    list-style: none;
    gap: 8px;

    .nav-item a {
      display: flex;
      padding: 8px 12px;
      align-items: center;
      text-decoration: none;
      color: map-get($body-text, body-color);
      text-align: center;
      border-radius: 4px;

      // Hover para itens não ativos
      &:hover {
        background-color: map-get($gray, 200);
        border-radius: 8px;
      }
    }

    // Estilo específico para itens ativos
    .nav-item-active a {
      background-color: map-get($primary-fade, 100);
      border-radius: 8px;

      &:hover {
        background-color: map-get($primary-fade, 100);
      }
    }
  }

  .navbar .navbar-button {
    margin-top: 16px;
    text-align: center;
  }

  .navbar .navbar-collapse {
    transition: none;
  }

  .navbar .navbar-collapse.collapsing {
    position: absolute;
    z-index: 3;
    top: 100%;
    background-color: var(--bs-light);
    left: 0;
    right: 0;
    box-shadow: 0px 24px 24px 0px rgba(0, 0, 0, 0.05);
    padding: 0 32px;
    overflow: hidden;
    transition: height 0.3s ease;
  }

  .navbar .navbar-collapse.collapsing .navbar-nav {
    padding: 12px 6px 56px 6px;
  }

  .navbar .navbar-collapse.collapse:not(.show) {
    display: none;
  }

  .navbar .navbar-collapse.collapse.show {
    position: absolute;
    height: auto;
    z-index: 3;
    top: 100%;
    background-color: var(--bs-light);
    left: 0;
    right: 0;
    box-shadow: 0px 24px 24px 0px rgba(0, 0, 0, 0.1);
    padding: 12px 32px 40px;
    display: block;
  }

  .navbar .navbar-collapse.collapse.show .navbar-nav {
    padding: 12px 6px 48px 6px;
  }

  .container-fluid {
    padding: 0;
  }

  .container-fluid a {
    padding: 0;
    width: auto;
    margin: 0;
  }

  .button-primary-link {
    text-decoration: none;
  }

  @include breakpoint-down('desktop-small') {

    ::v-deep(.primary-button) {
      width: 224px;
    }

    .navbar {
      padding: 16px 48px;
    }

  }

  // Specific media
  @media screen and (max-width: 991px) {

    ::v-deep(.logo-text) {
      display: flex;
    }

    .navbar {
      padding: 16px 48px
    }

  }

  @include breakpoint-down('mobile-large') {
    .navbar {
      padding: 16px 32px;
    }
  }

</style>
