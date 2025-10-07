<template>
    <div>
        <!-- Formulario de cierre -->
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                        <span>Cierre final investigación suceso clínico</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
            </v-toolbar>
        </v-card-title>

        <v-col cols="12">
            <v-autocomplete outlined :items="['Leve', 'Severo', 'Moderado']" dense
                v-model="eventoAdverso.severidad_evento" label="Severidad del evento"
                hint="Determine la severidad del evento antes de su cierre" persistent-hint />
        </v-col>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn dark small color="orange darken-2" @click="rechazarCierreParcial">
                Rechazar cierre parcial
                <v-icon right>mdi-close-circle</v-icon>
            </v-btn>

            <v-btn small color="success" @click="cerrarEvento()" :loading="loading">
                Cerrar investigación
                <v-icon right>mdi-check</v-icon>
            </v-btn>

            <v-btn color="red" @click="cerrar()" small dark>
                Cancelar
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-actions>
    </div>
</template>

<script>
export default {
    name: 'WorkspaceJsonCierreEventoComponente',

    props: {
        eventoAdverso: Object,
    },

    data() {
        return {
            formularioCierre: {
                evento_adverso_id: '',
                analisis_evento_id: '',
                severidad_evento: '',
            },
            loading: false,
        };
    },

    methods: {
        cerrarEvento() {
            if (!this.eventoAdverso.severidad_evento) {
                this.$toast.error('Debe seleccionar la severidad del evento antes de cerrarlo.');
                return;
            }

            this.loading = true;
            this.formularioCierre.evento_adverso_id = this.eventoAdverso.id;
            this.formularioCierre.severidad_evento = this.eventoAdverso.severidad_evento;

            this.$axios.post('/eventos-adversos/cerrar', this.formularioCierre)
                .then(() => {
                    this.$toast.success('Se ha cerrado el evento correctamente!');
                    this.$emit('eventoCerrado');
                })
                .catch(e => {
                    console.error(e.response?.data || e);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        rechazarCierreParcial() {
            this.$swal({
                title: "¿Rechazar cierre parcial?",
                text: "Al rechazar el cierre parcial, el evento adverso quedará reasignado a los colaboradores responsables, quienes deberán continuar con el proceso de investigación y revisión.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e65100",
                cancelButtonColor: "#9e9e9e",
                confirmButtonText: "Sí, rechazar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.loading = true;
                    this.$axios.post("/eventos-adversos/actualizar-estado", {
                        evento_adverso_id: this.eventoAdverso.id,
                        estado_id: 6,
                    })
                        .then(() => {
                            this.$toast.info("El cierre parcial ha sido rechazado. El evento fue reasignado.");
                            this.$emit("eventoCerrado");
                        })
                        .catch((e) => {
                            console.error(e.response?.data || e);
                            this.$toast.error("Hubo un error al rechazar el cierre parcial.");
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                }
            });
        },

        cerrar() {
            this.$emit('cerrarDialog');
        },
    },
};
</script>
