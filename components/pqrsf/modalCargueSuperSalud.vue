<template>
    <div>
        <v-dialog v-model="mostrarModalCargueSuperSalud" persistent max-width="900px">
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-file-upload-outline" class="text-center">
                    <b>Cargue Masivo</b>
                </v-alert>
                <v-card-text>
                    <v-form ref="formCargueMasivo">
                        <v-col cols="12" sm="12" md="12">
                            <v-alert text dense border="left" color="blue-grey" icon="mdi-information-box-outline">
                                <b>IMPORTANTE:</b> Es indispensable utilizar el formato
                                proporcionado para garantizar la correcta carga de datos. Puede
                                descargar el formato
                                <b style="
                    cursor: pointer;
                    text-decoration: underline;
                    color: blue;
                  " @click="descargarFormato()">aquí</b>.
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-file-input v-model="formCargue.archivo" label="Formato *" accept=".xlsx, .xls"
                                :rules="[rules.obligatorio, rules.fileSize]" outlined dense clearable
                                append-icon="mdi-paperclip" prepend-icon="" counter show-size></v-file-input>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete label="Buscar Responsable" dense outlined v-model="formCargue.user_id"
                                :items="opcionesOperador" item-text="nombre" item-value="user_id"
                                :loading="loading.opcionesOperador"></v-autocomplete>
                        </v-col>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small dark @click="cerrarModal">Cerrar</v-btn>
                    <v-btn color="success" small dark @click="enviarFormulario">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
    props: {
        mostrarModalCargueSuperSalud: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            formCargue: {
                archivo: null,
                user_id: null,
            },
            rules: {
                obligatorio: function (v) {
                    return !!v || "Este campo es obligatorio.";
                },
                fileSize: function (files) {
                    if (!files || !files.length) return true;
                    for (let file of files) {
                        if (file.size > 1073741824) {
                            return "Cada archivo no debe superar 1GB";
                        }
                    }
                    return true;
                },
            },
            loading: {
                opcionesOperador: false,
            },
            opcionesOperador: [],
        };
    },
    watch: {
        mostrarModalCargueSuperSalud(newValue) {
            if (newValue) {
                this.listarOpcionesOperadores();
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.limpiarFormulario();
            this.$emit("update:mostrarModalCargueSuperSalud", false);
        },

        limpiarFormulario() {
            this.formCargue = {
                archivo: null,
                user_id: null,
            };

            this.$refs.formCargueMasivo.resetValidation();
        },

        enviarFormulario() {
            if (!this.$refs.formCargueMasivo.validate()) {
                return;
            }

            const formData = new FormData();
            formData.append("archivo", this.formCargue.archivo);
            formData.append("user_id", this.formCargue.user_id);

            this.setPreload(true);

            this.$axios
                .post("/formularios-pqrsf/cargueMasivoSupersalud", formData)
                .then((res) => {
                    console.log(res.data.original);
                    if (
                        res.data.original.status === "error" &&
                        res.data.original.errores
                    ) {
                        // Si hay errores en la respuesta, mostrarlos en $swal
                        const errores = res.data.original.errores;
                        const erroresHtml = errores
                            .map((err) => `<li style="margin-bottom: 5px;">${err}</li>`)
                            .join("");

                        this.$swal.fire({
                            type: "error",
                            title: "Errores en el cargue masivo",
                            html: `
    <div style="max-height: 300px; overflow-y: auto; margin-left: 20px; text-align: left;">
      <ul style="padding-left: 20px;">${erroresHtml}</ul>
    </div>
  `,
                            confirmButtonText: "Entendido",
                        });
                    } else {
                        // Si no hay errores, es un éxito
                        this.$toast.success(res.data.original.mensaje);
                        this.$emit("recargarPQRFsPendientes");
                        this.cerrarModal();
                    }
                })
                .catch(() => {
                    this.$toast.error("Error al cargar el archivo");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        descargarFormato() {
            const link = document.createElement("a");
            link.href = "/formato_cargue_supersalud.xlsx";
            link.download = "formato_cargue_supersalud.xlsx";
            link.click();
        },

        listarOpcionesOperadores() {
            this.loading.opcionesOperador = true;
            this.$axios
                .get("/operador/listarActivos")
                .then((res) => {
                    this.opcionesOperador = res.data.map((operador) => {
                        return {
                            user_id: operador.user_id,
                            nombre: `${(operador.nombre || '')} ${(operador.apellido || '')}`.trim() + ` - ID: ${operador.user_id}`,
                        };
                    });
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los operadores");
                })
                .finally(() => {
                    this.loading.opcionesOperador = false;
                });
        },
    },
};
</script>
