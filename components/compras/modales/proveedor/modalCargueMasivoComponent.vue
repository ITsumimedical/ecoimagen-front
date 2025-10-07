<template>
    <v-card>
        <v-alert
            text
            dense
            border="bottom"
            type="info"
            :icon="false"
            class="text-center"
        >
            <b>CARGUE MASIVO DE PROVEEDORES</b>
        </v-alert>

        <v-container>
            <v-row justify="center">
                <v-col md="8">
                    <v-file-input
                        outlined
                        dense
                        show-size 
                        :rules="[maxSizeAdjuntos]"
                        v-model="adjuntos"
                        accept=".xlsx"
                        placeholder="Seleccione un archivo"
                    ></v-file-input>
                </v-col>
            </v-row>

            <v-container>
                <v-row justify="center">
                    <v-col cols="12" md="8">
                        <v-alert
                            text
                            dense
                            border="left"
                            color="warning"
                            class="text-center"
                        >
                        <v-icon color="warning">mdi-information</v-icon>
                            DEBE UTILIZAR LA PLANTILLA CORRECTA PARA EVITAR ERRORES
                        </v-alert>
                    </v-col>
                </v-row>
            </v-container>

            <v-row justify="space-between">
                <v-col cols="4">
                    <v-btn block small color="error" @click="cerrarModal()"
                        >Cancelar</v-btn
                    >
                </v-col>
                <v-col cols="4">
                    <v-btn
                        block
                        small
                        color="blue-grey"
                        @click="descargarPlantilla()"
                        class="white--text"
                    >
                        Plantilla
                        <v-icon right>mdi-cloud-download</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="4">
                    <v-btn
                        block
                        small
                        color="success"
                        @click="cargaMasiva()"
                    >
                        Cargar Proveedores
                        <v-icon right>mdi-cloud-upload</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import { minAdjuntos, maxSizeAdjuntosRule } from "@/utils/rules";
import { mapActions } from "vuex";

export default {
    data() {
        return {
            adjuntos: [],
            maxSizeAdjuntos: maxSizeAdjuntosRule,
            minAdjuntos: minAdjuntos,
        };
    },

    methods: {
       ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.$emit("cerrar");
        },
        cargaMasiva() {
            if (this.adjuntos.length === 0) {
                this.$toast.error("Por favor, seleccione un archivo antes de continuar.");
                return;
            }

            const formData = new FormData();
            formData.append("file", this.adjuntos);

            this.setPreload(true);

            this.$axios
                .post("proveedores-compras/carga-masiva", formData)
                .then(() => {
                    this.$toast.success("Proveedores cargados correctamente.");
                    this.cerrarModal();
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.error || 'Error al cargar los proveedores.');
                }).finally(() => {
                    this.setPreload(false);
                });
        },

        descargarPlantilla() {
            const link = document.createElement("a");
            link.href = "/proveedores_compras_masivo.xlsx";
            link.download = "proveedores_compras_masivo.xlsx";
            link.click();
        },
    },
};
</script>
