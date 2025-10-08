<template>
    <v-dialog max-width="800px" v-model="mostrarModalSolucionar">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-file-document-check" class="text-center">
                <b>Solucionar PQRF N° {{ pqrsf?.id }}</b>
            </v-alert>
            <v-card-text>
                <v-form ref="formSolucionarPqrsf">
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea dense outlined v-model="formSolucionar.motivo" auto-grow
                                label="Motivo de Solución *" :rules="[rules.obligatorio, rules.min]"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-file-input dense outlined v-model="formSolucionar.adjuntos" label="Adjuntar Archivos"
                                counter show-size append-icon="mdi-paperclip" prepend-icon="" multiple clearable
                                small-chips accept=".jpg, .jpeg, ,.png, .pdf" :rules="[rules.fileSize]"></v-file-input>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" small dark @click="cerrarModal"> Cerrar </v-btn>
                <v-btn color="success" small dark @click="enviarFormuarioPqrsf()">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from "vuex";

export default {
    props: {
        mostrarModalSolucionar: {
            type: Boolean,
            default: false,
        },
        pqrsf: {
            type: Object,
            default: () => { },
        },
        solucionCentral: {
            Type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            formSolucionar: {
                motivo: "",
                adjuntos: [],
            },
            rules: {
                obligatorio: (v) => !!v || "Este campo es obligatorio.",
                min: (v) =>
                    v.length >= 10 || "Este campo debe tener al menos 10 caracteres",
                fileSize: (files) => {
                    if (!files || !files.length) return true;
                    for (let file of files) {
                        if (file.size > 1073741824) {
                            return "Cada archivo no debe superar 1GB";
                        }
                    }
                    return true;
                },
            },
        };
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.limpiarFormulario();
            this.$emit("update:mostrarModalSolucionar", false);
        },

        limpiarFormulario() {
            this.formSolucionar = {
                motivo: "",
                adjuntos: [],
            };

            this.$refs.formSolucionarPqrsf.resetValidation();
        },

        enviarFormuarioPqrsf() {
            if (!this.$refs.formSolucionarPqrsf.validate()) {
            }

            const formData = new FormData();

            formData.append("motivo", this.formSolucionar.motivo);
            formData.append("pqrsf_id", this.pqrsf.id);
            formData.append("afiliado_id", this.pqrsf.afiliado.id);
            formData.append("email", this.pqrsf.correo);
            formData.append(
                "nombre",
                [
                    this.pqrsf.afiliado.nombre,
                    this.pqrsf.afiliado.apellido
                ].filter(Boolean).join(" ")
            );
            formData.append("solucionCentral", this.solucionCentral);
            for (let file = 0; file < this.formSolucionar.adjuntos.length; file++) {
                formData.append("adjuntos[]", this.formSolucionar.adjuntos[file]);
            }

            this.setPreload(true);

            this.$axios
                .post("/formularios-pqrsf/solucionar", formData)
                .then(() => {
                    this.$toast.success("PQRF solucionada con éxito");
                    this.cerrarModal();
                    this.$emit("cerrarModal");
                    this.$emit("recargarPQRFs");
                })
                .catch(() => {
                    this.$toast.error("Error al solucionar el PQRF");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },
    },
};
</script>
