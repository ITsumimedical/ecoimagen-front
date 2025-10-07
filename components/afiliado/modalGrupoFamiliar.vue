<template>
    <v-dialog v-model="mostrarGrupoFamiliar" persistent max-width="1400px">
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Grupo familiar</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table dense :headers="headersGrupoFamiliar" :items="grupoFamiliar"
                            no-data-text="El afiliado no posee grupo familiar"
                            loading-text="Cargando... Por favor espere" :loading="loading.tablaGrupoFamiliar">
                            <template v-slot:[`item.estado`]="{ item }">
                                <v-chip label dark small :color="obtenerEstado(item.estado_afiliado.id).color">{{
                                    item.estado_afiliado.nombre }}</v-chip>
                            </template>
                            <template v-slot:[`item.afiliado`]="{ item }">
                                {{ [item.primer_nombre, item.segundo_nombre, item.primer_apellido,
                                item.segundo_apellido].filter(Boolean).join(' ') }}
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn small dark color="red" @click="cerrarModal()"> Cerrar </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
export default {
    props: {
        mostrarGrupoFamiliar: {},
        afiliado: {},
    },
    data() {
        return {
            grupoFamiliar: [],
            headersGrupoFamiliar: [
                { text: "Afiliado", value: "afiliado", align: "center" },

                { text: "Estado", value: "estado", align: "center" },
                {
                    text: "Tipo de Afiliado",
                    value: "tipo_afiliado.nombre",
                    align: "center",
                },
                {
                    text: "Tipo de Documento",
                    value: "tipo_documento.nombre",
                    align: "center",
                },
                { text: "N° de Documento", value: "numero_documento", align: "center" },
                { text: "Correo Electrónico", value: "correo1", align: "center" },
                { text: "Celular", value: "celular1", align: "center" },
                { text: "Teléfono", value: "telefono", align: "center" },
                { text: "Parentesco", value: "parentesco", align: "center" },
            ],
            loading: {
                tablaGrupoFamiliar: false,
            },
        };
    },
    watch: {
        mostrarGrupoFamiliar(newValue) {
            if (newValue) {
                this.listarGrupoFamiliar();
            }
        },
    },
    computed: {
        nombreCompletoAfiliado() {
            if (!this.afiliado) return '';
            return [
                this.afiliado.primer_nombre,
                this.afiliado.segundo_nombre,
                this.afiliado.primer_apellido,
                this.afiliado.segundo_apellido
            ]
                .filter(Boolean)
                .join(' ');
        },
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.$emit("update:mostrarGrupoFamiliar", false);
        },

        listarGrupoFamiliar() {
            this.loading.tablaGrupoFamiliar = true;
            this.$axios
                .post("/afiliados/grupoFamiliar", this.afiliado)
                .then((res) => {
                    this.grupoFamiliar = res.data;
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al cargar el grupo familiar");
                })
                .finally(() => {
                    this.loading.tablaGrupoFamiliar = false;
                });
        },

        obtenerEstado(estadoId) {
            switch (estadoId) {
                //Activo
                case 1:
                    return { color: "green darken-2" };
                //Retirado
                case 31:
                    return { color: "red darken-2" };
                //Protección Laboral Cotizante
                case 32:
                    return { color: "yellow darken-3" };
                //Protección Laboral Beneficiario
                case 33:
                    return { color: "orange darken-2" };
                default:
                    return { color: "gray" };
            }
        },
    },
};
</script>
