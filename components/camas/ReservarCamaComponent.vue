<template>
    <div>
        <v-card>
            <v-alert dense text color="blue" class="text-center">
                <b v-if="tipo ==50">Reservar</b>
                <b v-if="tipo ==51">Liberar</b>
                <b v-if="tipo ==52">Mantenimiento</b>
                 <b v-if="tipo ==53">Liberar Mantenimiento</b>
            </v-alert>
            <v-card-text>
                <v-form ref="camaForm">
                    <v-row dense>
                        <v-textarea label="Descripcion" v-model="form.descripcion" rows="2"></v-textarea>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="red" dark @click="cerrarModal()">Cerrar</v-btn>
                <v-btn small color="success" dark @click="guardarReservaCama()">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import {
        mapActions
    } from "vuex"
    export default {
        middleware({
            $can,
            redirect
        }) {
            if (!$can('blog.vista')) {
                return redirect('/');
            }
        },
        props: {
            datos: {
                type: Number
            },
            tipo: {
                type: Number
            }
        },
        name: 'FrontHorusParametrizacion',
        data() {
            return {
                form: {
                    descripcion: ''
                }
            };
        },

        mounted() {

        },

        methods: {
            ...mapActions('app', ['setPreload']),

            cerrarModal() {
                this.form.descripcion = ''
                this.$emit('cerrarModal')
            },

            guardarReservaCama() {
                this.setPreload(true)
                this.form.tipo_id = this.tipo
                this.form.cama_id = this.datos
                if (this.tipo == 51 || this.tipo == 53) {
                    this.form.estado = 1
                } else if (this.tipo == 50) {
                    this.form.estado = 65
                } else {
                    this.form.estado = 66
                }
                this.$axios.post("/novedad-cama/crear", this.form)
                    .then((res) => {
                        this.$toast.success('Se creo la novedad con exito')
                        this.cerrarModal()
                    })
                    .catch((error) => {
                        this.$toast.error(
                            "Ocurrió un error al crear"
                        );
                    })
                    .finally(() => {
                        this.setPreload(false)
                    });
            },
        },
    };

</script>

<style lang="scss" scoped>

</style>
