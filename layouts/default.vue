<template>
    <v-app dark>
        <v-navigation-drawer v-model="drawer" app floating class="elevation-1" :right="$vuetify.rtl" width="260"
            style="background: #172640">
            <template v-slot:prepend>
                <div class="d-flex pa-4 justify-center" style="background: #172640">
                    <h3 style="color: white; cursor: pointer" @click="$router.push('/inicio/bannerInicial')">
                        ECOIMAGEN SALUD
                    </h3>
                </div>
                <hr/>
            </template>

            <!-- MENU DefaultLayout -->
            <v-list style="background: #172640">
                <template v-for="item in items">
                    <v-list-group :key="item.title" v-model="item.active" no-action v-if="$can(item.can)"
                        append-icon="">
                        <template v-slot:activator>
                            <v-list-item-icon style="margin-right: 5px">
                                <v-icon v-text="item.action" style="color: white"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.title"
                                    style="font-size: 13px; color: white"></v-list-item-title>
                            </v-list-item-content>
                            <v-icon slot="append-icon" style="color: white">mdi-chevron-down</v-icon>
                        </template>

                        <!-- Hijos -->
                        <template v-for="child in item.items || []">
                            <v-list-item :key="`${item.title}::${child.title}`" :to="child.to"
                                style="padding-left: 42px; color: white" v-if="$can(child.can)"
                                :class="{ 'active-child': isActive(child.to) }">
                                <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-list-item-icon style="margin-right: 10px; color: white" v-on="on"
                                            v-bind="attrs">
                                            <v-icon style="color: white">mdi-chevron-right</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title v-text="child.title" v-on="on"
                                                style="font-size: 13px"></v-list-item-title>
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

        <v-app-bar app flat color="surface"
            style="background: linear-gradient(to right, rgb(13, 120, 192), rgb(13, 120, 192), rgb(13, 120, 192))">
            <v-app-bar-nav-icon style="color: white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
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
            </div>

            <div v-if="$config.PROJECT_NAME === 'sumimedical'" class="me-3">
                <a target="_blank"
                    href="https://docs.google.com/forms/d/1gVnEpzf5zJv65Xmn3cS_zoqYhzmMXWjAWnbdrAWIoo0/edit">
                    <v-img contain max-height="100" max-width="140" src="/images/boton.png"></v-img>
                </a>
            </div>

            <toolbar-user />
        </v-app-bar>

        <v-main style="background: whitesmoke">
            <v-container grid-list-md fluid class="pa-1" style="padding: 17px !important">
                <Nuxt />
            </v-container>
        </v-main>

        <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
            <v-list>
                <v-list-item @click.native="right = !right">
                    <v-list-item-action>
                        <v-icon light>mdi-repeat</v-icon>
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
        <modal-cambio-contrasena-por-expiracion v-if="$store.state.cambioContrasena.mostrarModalCambioContrasena"
            @close="$store.dispatch('cambioContrasena/cerrarModalCambioContrasena')" />
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
            items: this.$menu, // ← viene de tu plugin/estado
            version: "2.0.2",
        };
    },
    computed: {
        ...mapState("app", ["preload"]),
    },
    mounted() {
        this.checkVersion();
        this.syncActiveFromRoute(); // abrir el grupo correcto al cargar
    },
    watch: {
        "$route.path"() {
            this.syncActiveFromRoute(); // re-sincroniza al navegar
        },
    },
    methods: {
        redireccionar(ruta) {
            this.$router.push(ruta);
            this.$refs.miga?.reset?.();
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

        // Considera activo si es ruta exacta o subruta (startsWith)
        isActive(path) {
            const current = this.$route.path || "";
            return current === path || current.startsWith(path + "/");
        },

        // Abre (o cierra) el list-group cuyo hijo esté activo
        syncActiveFromRoute() {
            if (!Array.isArray(this.items)) return;
            this.items.forEach((grp, i) => {
                const hasActiveChild =
                    Array.isArray(grp?.items) && grp.items.some((ch) => this.isActive(ch.to));
                // Mantén la reactividad en Vue 2
                this.$set(grp, "active", !!hasActiveChild);
                // Si quieres cerrar grupos sin hijos activos, déjalo tal cual (false).
                // Si quieres mantener el estado manual del usuario, solo abre si true y no cierres si es false.
            });
        },
    },
};
</script>

<style>
.v-navigation-drawer__content::-webkit-scrollbar {
    width: 8px;
}

.v-navigation-drawer__content::-webkit-scrollbar-track {
    background: #172640;
}

.v-navigation-drawer__content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.v-navigation-drawer__content::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

/* ============ Resaltado de ítem activo en menú ============ */
.active-child {
    background: rgba(255, 255, 255, 0.12) !important;
    border-left: 3px solid #4fc3f7;
    color: #ffffff !important;
}

.active-child .v-list-item__title,
.active-child .v-icon {
    color: #ffffff !important;
    font-weight: 600;
}
</style>
