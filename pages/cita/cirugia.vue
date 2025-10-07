<template>
    <div>
        <v-alert text dense border="left" type="info" :icon="false" class="text-center">
            <b>MÓDULO DE AGENDAMIENTO CIRUGIA</b>
        </v-alert>
        <v-container fluid>
            <!-- Buscar Afiliado -->
            <v-row dense>
                <v-col cols="12" md="4" sm="12">
                    <v-autocomplete dense outlined label="Tipo de documento" :items="tiposDocumentos" :loading="loading"
                        no-data-text="No hay resultados" item-value="id" item-text="nombre"
                        v-model="datosBuscarAfiliado.tipo_documento" />
                </v-col>
                <v-col cols="12" md="4" sm="12">
                    <v-text-field dense outlined label="Número documento" @keyup.enter="consultarAfiliado()"
                        v-model.trim="datosBuscarAfiliado.numero_documento" />
                </v-col>
                <v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
                    <v-btn color="primary" dark @click="consultarAfiliado()" style="width: 50%">Consultar <v-icon
                            right>mdi-magnify</v-icon></v-btn>
                    <v-btn color="red" dark @click="
                        limpiarAfiliado();
                    " style="width: 50%">Limpiar<v-icon right>mdi-close</v-icon></v-btn>
                </v-col>
            </v-row>

            <v-row dense v-if="afiliado">
                <v-col cols="12" md="12" sm="12">
                    <EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true" />
                </v-col>
            </v-row>
            <v-row dense v-if="afiliado">
                <v-col cols="12" md="12" sm="12">
                    <EditarAfiliadoComponente :afiliado="afiliado" :modoEdicion="true" :mostrarClasificaciones="true" />
                </v-col>
            </v-row>
            <v-row dense v-if="afiliado">
                <v-col cols="12" md="12" sm="12">
                    <Cirugia :afiliado="afiliado" />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "~/components/afiliado/FormularioAfiliadoComponente.vue";
import Cirugia from "~/components/agendamientoCirugia/cirugia.vue";
export default {
    name: 'componenteCirugia',
    components: { EditarAfiliadoComponente, Cirugia },
    data() {
        return {
            afiliado: null,
            tiposDocumentos: [],
            loading: false,
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
        }
    },
    mounted() {
        this.listarTiposDocumentos();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),
        listarTiposDocumentos() {
            this.loading = true;
            this.$axios
                .get("/tipo-documento/listar")
                .then((res) => {
                    this.tiposDocumentos = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de documento"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        consultarAfiliado() {
            this.setPreload(true);
            this.$axios
                .get(
                    `/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
                )
                .then((res) => {
                    this.afiliado = res.data;
                    this.formGenerarCita.paciente = this.afiliado;
                    // this.buscarOrdenesAfiliado();
                })
                .catch((error) => {
                    this.$toast.error(
                        "El afiliado no se encuentra registrado en la base de datos."
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },
        limpiarAfiliado() {
            this.datosBuscarAfiliado = {
                numero_documento: null,
                tipo_documento: null,
            };
            this.afiliado = null;
        },
    }
}
</script>
