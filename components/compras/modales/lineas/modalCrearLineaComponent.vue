<template>
    <v-card>
        <v-alert icon="mdi-domain" dense border="left" text type="info">
            {{ linea.id ? "Editar Línea" : "Nueva Línea" }}
        </v-alert>
        <v-card-text>
            <v-row dense>
                <v-col cols="12">
                    <v-text-field
                        :error-messages="errors.nombre"
                        label="Nombre de la línea"
                        outlined
                        dense
                        v-model="formLinea.nombre"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="cerrarModal()">Cancelar</v-btn>
                <v-btn color="success" small @click="guardarLinea()">Guardar</v-btn>
            </v-card-actions>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
    props: {
        linea: {
            type: Object,
            default: () => ({ id: null, nombre: "" }),
        },
    },

    data() {
        return {
            formLinea: { ...this.linea },
            errors: {},
        };
    },

    watch: {
        linea: {
            handler(newValue) {
                this.formLinea = { ...newValue };
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

        guardarLinea() {
            const url = this.formLinea.id
                ? `/lineas-compras/modificar-linea/${this.formLinea.id}`
                : "/lineas-compras/crear-lineas";

            this.setPreload(true);
            this.$axios
                .post(url, this.formLinea)
                .then(() => {
                    this.$toast.success(
                        this.formLinea.id
                            ? "Línea actualizada exitosamente!"
                            : "Línea creada exitosamente!"
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
