<template>
    <div>
        <!-- Suspension -->
        <v-dialog persistent v-model="mostrarSuspensionModal" max-width="700">
            <v-card>
                <v-alert text dense border="left" type="warning" icon="mdi-file-document-remove-outline">
                    <b>Información de la Suspensión</b>
                </v-alert>
                <v-card-text>
                    <p>
                        <b>Fecha de Suspensión:</b>
                        {{
                            $moment(suspension?.fecha_suspension).format("dddd, D MMMM, YYYY")
                        }}
                    </p>
                    <p>
                        <b>Suspendido por:</b>
                        {{
                            [
                                suspension?.funcionario_suspende?.operador?.nombre,
                                suspension?.funcionario_suspende?.operador?.apellido
                        ].filter(Boolean).join(' ') || 'Sin nombre'
                        }}
                    </p>
                    <p>
                        <b>Motivo de la Suspensión</b>
                        {{ suspension?.motivo_suspension }}
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="cerrarModal">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
    props: {
        mostrarSuspensionModal: Boolean,
        ordenArticuloId: Number,
    },
    data() {
        return {
            suspension: null,
        };
    },
    watch: {
        mostrarSuspensionModal(newValue) {
            if (newValue) {
                this.listarSuspension();
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),
        cerrarModal() {
            this.suspension = null;
            this.$emit("update:mostrarSuspensionModal", false);
        },

        listarSuspension() {
            this.setPreload(true);
            this.$axios
                .get(`/ordenamiento/listarSuspension/${this.ordenArticuloId}`)
                .then((res) => {
                    this.suspension = res.data;
                })
                .catch((e) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar la suspensión del medicamento"
                    );
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },
    },
};
</script>
