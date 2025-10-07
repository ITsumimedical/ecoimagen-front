<template>
    <v-dialog v-model="mostrarModalCrear" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Cuentas de Alto Costo - Crear Patología</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formCrearPatologia">
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field dense outlined label="Patología *" v-model="formPatologia.nombre"
                                :rules="[rules.obligatorio]" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="error" small dark @click="cerrarModal">
                    Salir
                </v-btn>
                <v-btn color="success" small dark @click="enviarFormulario">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    props: {
        mostrarModalCrear: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            rules: {
                obligatorio: v => !!v || 'Este campo obligatorio.',
            },
            formPatologia: {
                nombre: '',
                clave: ''
            },
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.$refs.formCrearPatologia.reset();
            this.$emit('update:mostrarModalCrear', false)
        },

        generarClave(nombre) {
            return nombre
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9\-]/g, '')
                .substring(0, 50);
        },

        async enviarFormulario() {
            if (!this.$refs.formCrearPatologia.validate()) return;

            this.setPreload(true);

            this.formPatologia.clave = this.generarClave(this.formPatologia.nombre);

            try {
                await this.$axios.post('/cac/crear-patologia', this.formPatologia);

                this.$toast.success('Patología creada correctamente.');

                this.cerrarModal();

                this.$emit('recargarDatos');

            } catch (error) {
                this.$toast.error('Ocurrió un error al crear la patología.');
            } finally {
                this.setPreload(false);
            }
        }

    }
}
</script>