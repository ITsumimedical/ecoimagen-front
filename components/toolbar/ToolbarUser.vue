<template>
    <v-menu offset-y left transition="slide-y-transition">
        <template v-slot:activator="{ on }">
            <v-btn icon class="elevation-2" v-on="on" style="color: white">
                <v-badge color="sumimedical" dot bordered offset-x="10" offset-y="10">
                    <v-avatar size="40">
                        <template v-if="nombreUsuario">
                            <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(nombreUsuario)}&background=0D8ABC&color=fff&size=150`"
                                alt="Avatar" />
                        </template>
                        <template v-else>
                            <v-progress-circular indeterminate color="white" size="20" width="2" />
                        </template>
                    </v-avatar>
                </v-badge>
            </v-btn>
        </template>


        <!-- user menu list -->
        <v-list dense nav>
            <v-list-item v-for="(item, index) in menu" :key="index" :exact="item.exact" :disabled="item.disabled"
                :to="item.route" link>
                <v-list-item-icon>
                    <v-icon small :class="{ 'grey--text': item.disabled }">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider class="my-1"></v-divider>

            <v-list-item link @click="submit()">
                <v-list-item-icon>
                    <v-icon small>mdi-logout-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Cerrar Sesion</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
/*
|---------------------------------------------------------------------
| Toolbar User Component
|---------------------------------------------------------------------
|
| Quickmenu for user menu shortcuts on the toolbar
|
*/
import { mapActions } from "vuex";
export default {
    data() {
        return {
            nombreUsuario: null,
            menu: [{
                icon: 'mdi-account-box-outline',
                text: 'Perfil',
                route: '/perfil'
            }
            ]
        }
    },

    async mounted() {
        await this.nombreUsuarioC();
    },

    methods: {
        ...mapActions('auth', ['logout']),
        ...mapActions('app', ['setPreload']),

        async submit() {
            try {
                this.setPreload(true)
                await this.logout();
            } catch (error) {
                console.log(error);
            } finally {
                this.setPreload(false)
            }
            this.$router.push('/');
        },

        async nombreUsuarioC() {
            const usuario = this.$store.state.auth.usuario;

            if (!usuario) {
                return;
            }

            if (usuario.tipo_usuario !== 2 && usuario.operador) {
                this.nombreUsuario = `${usuario.operador.nombre} ${usuario.operador.apellido}`;
            } else if (usuario.datosAfiliado) {
                this.nombreUsuario = `${usuario.datosAfiliado.primer_nombre} ${usuario.datosAfiliado.primer_apellido || ''}`;
            } else {
                this.nombreUsuario = "Usuario";
            }
        }

    }
}

</script>
