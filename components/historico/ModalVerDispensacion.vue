<template>
    <div>
        <!-- Dispensaciones -->
        <v-dialog persistent v-model="mostrarDispensacionModal" max-width="600px">
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-package-variant-closed-check">
                    <b> Información de Dispensación </b>
                </v-alert>
                <v-card-text v-if="movimiento">
                    <p>
                        <b>Fecha de Dispensación:</b>
                        {{ $moment(movimiento.created_at).format("dddd, D MMMM, YYYY") }}
                    </p>
                    <p>
                        <b>Dispensado en:</b>
                        {{ movimiento.bodega_origen?.nombre }}
                    </p>
                    <p>
                        <b>Dispensado por:</b>
                        {{
                            [
                                movimiento.user?.operador?.nombre,
                                movimiento.user?.operador?.apellido
                        ].filter(Boolean).join(' ') || 'Sin nombre'
                        }}
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="cerrarModal">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Preload -->
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Tranquilo procesamos tu solicitud!
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        mostrarDispensacionModal: Boolean,
        ordenArticuloId: Number,
    },
    data() {
        return {
            preload: false,
            movimiento: null,
        };
    },
    watch: {
        mostrarDispensacionModal(newVal) {
            if (newVal) {
                this.listarDispensacion();
            }
        },
    },
    methods: {
        cerrarModal() {
            this.movimiento = null;
            this.$emit("update:mostrarDispensacionModal", false);
        },

        listarDispensacion() {
            this.preload = true;
            this.$axios
                .get(`/movimientos/listarDispensacion/${this.ordenArticuloId}`)
                .then((res) => {
                    this.movimiento = res.data.data[0];
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al cargar los datos");
                    console.log(e);
                })
                .finally(() => {
                    this.preload = false;
                });
        },
    },
};
</script>
