<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
      class="elevation-1"
      :right="$vuetify.rtl"
      width="260"
      style="background: #172640"
    >
      <template v-slot:prepend>
        <div class="d-flex pa-2 justify-center" style="background: #172640">
          <img
            src="/images/LogoHorusHealth.png"
            height="48"
            alt="logo"
            class="mr-1"
            @click="$router.push('/inicio/bannerInicial')"
      style="cursor: pointer"
          />
        </div>
        <hr />
      </template>
      <!-- MENU DefaultLayout -->
      <v-list style="background: #172640">
        <template v-for="item in items">
          <v-list-group
            :key="item.title"
            v-model="item.active"
            no-action
            v-if="$can(item.can)"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-icon style="margin-right: 5px">
                <v-icon v-text="item.action" style="color: white"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.title"
                  style="font-size: 13px; color: white"
                ></v-list-item-title>
              </v-list-item-content>
              <v-icon slot="append-icon" style="color: white"
                >mdi-chevron-down</v-icon
              >
            </template>
            <template v-for="child in item.items">
              <v-list-item
                :key="child.title"
                :to="child.to"
                style="padding-left: 42px; color: white"
                v-if="$can(child.can)"
                :class="{ 'active-child': child.to === $route.path }"
              >
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-icon
                      style="margin-right: 10px; color: white"
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon style="color: white">mdi-chevron-right</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="child.title"
                        v-on="on"
                        style="font-size: 13px"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <span>{{ child.title }}</span>
                </v-tooltip>
              </v-list-item>
            </template>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      flat
      color="surface"
      style="background: linear-gradient(to right, #c59109, #c59109, #172640)"
    >
      <v-app-bar-nav-icon
        style="color: white"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <!-- <v-card class="flex-grow-1 d-flex mt-3" color="surface" flat>
  <div class="d-flex flex-grow-1 align-center">
    <v-autocomplete ref="miga" :items="$menuDetallado" item-text="title" item-value="to"
      @change="redireccionar($event)" class="hidden-xs-only" placeholder="Buscar módulo"
      prepend-inner-icon="mdi-magnify" hide-details rounded>
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title><strong>{{ data.item.title }}</strong>
            {{ data.item.component }}</v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</v-card> -->
      <v-spacer></v-spacer>
      <span style="color: white">
        ¡Bienvenido!
        <strong>
          {{
            $store.state.auth.usuario.operador
              ? `${$store.state.auth.usuario.operador.nombre_completo}
                    (${$store.state.auth.usuario.operador.tipo_documento_documento})`
              : $store.state.auth.usuario.datosAfiliado
              ? $store.state.auth.usuario.datosAfiliado.nombre_completo
              : ""
          }}
        </strong>
      </span>
      <v-spacer></v-spacer>
      <div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']">
        <toolbar-notifications />
        <!-- <toolbar-notifications />
<v-badge color="sumimedical" bordered content="6" offset-x="22" offset-y="22">
  <v-btn icon @click="modalChat=true">
    <v-icon style="color: white">mdi-message-text-outline</v-icon>
  </v-btn>
</v-badge>
<v-dialog v-model="modalChat" persistent fullscreen hide-overlay transition="dialog-bottom-transition"
  scrollable>
  <v-card>
    <chatComponent @respuestaComponente="modalChat = false" />
  </v-card>
</v-dialog> -->
      </div>
      <div v-if="$config.PROJECT_NAME === 'sumimedical'" class="me-3">
        <a
          target="_blank"
          href="https://docs.google.com/forms/d/1gVnEpzf5zJv65Xmn3cS_zoqYhzmMXWjAWnbdrAWIoo0/edit"
        >
          <v-img
            contain
            max-height="100"
            max-width="140"
            src="/images/boton.png"
          >
          </v-img>
        </a>
      </div>
      <!-- <boton-whatsapp :max-width="60" :max-height="60" /> -->
      <!-- <v-divider vertical inset class="mx-6" dark /> -->
      <toolbar-user />
    </v-app-bar>
    <v-main style="background: whitesmoke">
      <!-- <v-bottom-navigation> </v-bottom-navigation> -->
      <v-container
        grid-list-md
        fluid
        class="pa-1"
        style="padding: 17px !important"
      >
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat</v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer app inset>
      <div class="overline d-flex">
        Copyright © {{ new Date().getFullYear() }} |
        <UsuariosActivosComponent />
      </div>
      <v-spacer></v-spacer>
      <div class="overline">
        Hecho con el
        <v-icon small color="pink">mdi-heart</v-icon>
        En
        <a href="#">HORUS-HEALTH</a>
      </div>
    </v-footer>

    <!-- preload global-->
    <transition name="fade">
      <PreloadComponent v-if="preload" />
    </transition>

    <!-- Modal Cambio Contraseña por Expiración -->
    <modal-cambio-contrasena-por-expiracion
      v-if="$store.state.cambioContrasena.mostrarModalCambioContrasena"
      @close="$store.dispatch('cambioContrasena/cerrarModalCambioContrasena')"
    />
  </v-app>
</template>

<script>
import ModalCambioContrasenaPorExpiracion from "~/components/usuario/modalCambioContrasenaPorExpiracion.vue";
import chatComponent from "@/components/chat/LayoutChat.vue";
import PreloadComponent from "@/components/helpers/PreloadComponent.vue";
import { mapState } from "vuex";
import BotonWhatsapp from "~/components/globales/botonWhatsapp.vue";
import UsuariosActivosComponent from "@/components/info/UsuariosActivosComponent.vue";

export default {
  name: "DefaultLayout",
  middleware: ["auth"],
  components: {
    BotonWhatsapp,
    chatComponent,
    PreloadComponent,
    UsuariosActivosComponent,
    ModalCambioContrasenaPorExpiracion,
  },

  data() {
    return {
      modalChat: false,
      fixed: false,
      drawer: true,
      showSearch: false,
      right: true,
      rightDrawer: false,
      items: this.$menu,
      version: "2.0.2",
    };
  },

  computed: {
    ...mapState("app", ["preload"]),
  },

  mounted() {
    this.checkVersion();
  },

  methods: {
    redireccionar(ruta) {
      this.$router.push(ruta);
      this.$refs.miga.reset();
    },

    checkVersion() {
      fetch("/version.json")
        .then((response) => response.json())
        .then((data) => {
          if (data.version != this.version) {
            //window.location.reload(true);
          } else {
            console.log("La app esta actualizada.");
          }
        });
    },
  },
};
</script>

<style>
.v-navigation-drawer__content::-webkit-scrollbar {
  width: 8px;
  /* Ancho del scrollbar */
}

.v-navigation-drawer__content::-webkit-scrollbar-track {
  background: #172640;
  /* Color de fondo del track */
}

.v-navigation-drawer__content::-webkit-scrollbar-thumb {
  background: #888;
  /* Color del thumb */
  border-radius: 4px;
  /* Bordes redondeados del thumb */
}

.v-navigation-drawer__content::-webkit-scrollbar-thumb:hover {
  background: #555;
  /* Color del thumb en hover */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active en versiones anteriores de Vue */ {
  opacity: 0;
}
</style>
