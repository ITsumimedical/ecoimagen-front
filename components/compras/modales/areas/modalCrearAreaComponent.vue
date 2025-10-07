<template>
    <v-card>
        <v-alert icon="mdi-domain" dense border="left" text type="info">
            {{ formArea.id ? "Editar Área" : "Nueva Área" }}
        </v-alert>
        <v-card-text>
            <v-row dense>
                <v-col cols="12">
                    <v-text-field
                        :error-messages="errors.nombre"
                        label="Nombre del Área"
                        outlined
                        dense
                        v-model="formArea.nombre"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="cerrarModal()">Cancelar</v-btn>
                <v-btn color="success" small @click="guardarArea()">Guardar</v-btn>
            </v-card-actions>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
    props: {
        area: {
            type: Object,
            default: () => ({ id: null, nombre: "" }),
        },
    },

    data() {
        return {
            formArea: { ...this.area },
            errors: {},
        };
    },

    watch: {
        area: {
            handler(newValue) {
                this.formArea = { ...newValue };
            },
            deep: true,
            immediate: true,
        },
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.$emit("cerrar");
        },

        guardarArea() {
            const url = this.formArea.id
                ? `/areas-proveedores/modificar-area/${this.formArea.id}`
                : "/areas-proveedores/crear-areas";

            this.setPreload(true);
            this.$axios
                .post(url, this.formArea)
                .then(() => {
                    this.$toast.success(
                        this.formArea.id
                            ? "Área actualizada correctamente!"
                            : "Área creada exitosamente!"
                    );
                    this.$emit("actualizar");
                    this.cerrarModal();
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },
    },
};
</script>