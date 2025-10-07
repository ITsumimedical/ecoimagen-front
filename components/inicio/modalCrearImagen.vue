<template>
    <v-dialog v-model="mostrarCrearImagen" persistent max-width="1000px">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-book-alert-outline">
                <b>Crear Nueva Imagen</b>
            </v-alert>
            <v-card-text>
                <v-form ref="formNuevaImagen">
                    <v-row dense>
                        <v-col cols="12" sm="9" md="9">
                            <v-text-field v-model="nuevaimagen.nombre" label="Nombre *" :rules="rules.nombre" dense>
                            </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                            <v-file-input v-model="nuevaimagen.adjunto" label="Imagen *" :rules="rules.adjunto" dense
                                accept=".jpeg, .jpg" chips small-chips></v-file-input>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="cerrarModal"> Cerrar </v-btn>
                <v-btn color="success" small @click="crearImagen"> Crear </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: {
            mostrarCrearImagen: Boolean,
        },
        data() {
            return {
                tiposUsuarios: [],
                nuevaimagen: {
                    nombre: "",
                    adjunto: null,
                },
                rules: {
                    nombre: [(v) => !!v || "El campo nombre es requerido"],
                    adjunto: [(v) => !!v || "El campo imagen es requerido"],
                },
            };
        },

        methods: {
            cerrarModal() {
                this.limpiarFormulario();
                this.$emit("update:mostrarCrearImagen", false);
            },
            crearImagen() {
                if (!this.$refs.formNuevaImagen.validate()) {
                    this.$toast.error("Debe corregir los errores antes de continuar");
                    return;
                }

                this.$emit("crearImagen", this.nuevaimagen);
                this.cerrarModal();
            },

            limpiarFormulario() {
                this.nuevaimagen = {
                    nombre: "",
                    adjunto: null,
                };

                this.$refs.formNuevaImagen.resetValidation();
            },

        },
    };

</script>
