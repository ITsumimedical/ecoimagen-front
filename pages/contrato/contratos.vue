<template>

    <v-card class="rounded-xxl">

        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Contratos</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-card-title>

        <v-card-text>
            <v-tabs show-arrows v-model="tab">
                <!-- Pestañas Condicionales Basadas en Permisos -->
                <v-tab key="listar">
                    Lista de contratos
                </v-tab>
                <v-tab key="contratos" v-if="$can('contrato.listar')">
                    Crear Contratos
                </v-tab>
                <v-tab key="tarifas" v-if="$can('contrato.listar')">
                    Parametrización de tarifas
                </v-tab>
                <v-tab key="modalidad" v-if="$can('contratos.modalidadContrato.listar')">
                    Modalidades de Contrato
                </v-tab>
                <v-tab key="minimo" v-if="$can('contrato.salarioMinimo.listar')">
                    Salario Mínimo
                </v-tab>
                <v-tab key="zona" v-if="$can('contrato.zona.listar')">
                  Zonas
                </v-tab>
                <v-tab key="geo" v-if="$can('contrato.georreferencia.listar')">
                    Georreferenciación
                </v-tab>
                <v-tab key="direccionamiento" v-if="$can('contrato.direccionamiento.listar')">
                    Direccionamiento
                </v-tab>
            </v-tabs>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text>
            <v-tabs-items v-model="tab">

                <!-- Lista de todos los contratos -->
                <v-tab-item key="lista">
                    <ListarContratosComponent />
                </v-tab-item>

                <!-- Crear Contratos -->
                <v-tab-item key="contratos">
                    <FormContratoComponent />
                </v-tab-item>

                <!-- Parametrización de tarifas -->
                <v-tab-item key="tarifas">
                    <v-card>
                        <v-card-text>
                            <v-autocomplete :items="prestadores" item-text="nombre" item-value="id" dense
                                :search-input.sync="rep" no-data-text="No hay contratos disponibles" label="Prestador"
                                v-model="prestador_id" @change="handleCambioPrestador" outlined class="mb-5">
                            </v-autocomplete>

                            <ListarContratosPorPrestadorComponent class="mb-10" v-model="contrato_id"
                                :prestador_id="prestador_id" />

                            <ListarTarifasPorContratoComponent :contrato_id="contrato_id" />

                        </v-card-text>
                    </v-card>

                </v-tab-item>

                <!-- Modalidades de Contrato -->
                <v-tab-item key="modalidales">
                    <ListarManualTarifarioComponent />
                </v-tab-item>

                <!-- Salario Mínimo -->
                <v-tab-item key="minimo">
                    <ListarSalarioMinimoComponent />
                </v-tab-item>

                <!-- Zonas -->
                <v-tab-item key="zona">
                  <ListarZonasComponent/>
                </v-tab-item>

                <!-- Georreferenciación -->
                <v-tab-item key="geo">
                    <ListarGeoreferenciaComponent />
                </v-tab-item>

                <!-- Direccionamiento -->
                <v-tab-item key="direccionamiento">
                    <ListarDireccionamientoComponent />
                </v-tab-item>

            </v-tabs-items>
        </v-card-text>

    </v-card>

</template>

<script>
import FormContratoComponent from "@/components/contrato/contratos/FormContratoComponent.vue";
import ListarContratosComponent from "@/components/contrato/contratos/ListarContratosComponent.vue";
import FormPrestadorComponent from "@/components/contrato/prestadores/FormPrestadorComponent.vue";
import AgregarCupsContratoComponent from "@/components/contrato/contratos/AgregarCupsContratoComponent.vue";
import AgregarCupsPropiosContratoComponent from "@/components/contrato/contratos/AgregarCupsPropiosContratoComponent.vue";
import AgregarPaqueteTarifaComponent from "@/components/contrato/tarifas/AgregarPaqueteTarifaComponent.vue";
import FormRepsComponent from "@/components/contrato/reps/FormRepsComponent.vue";
import ListarManualTarifarioComponent from "@/components/contrato/manualTarifario/ListarManualTarifarioComponent.vue";
import ListarSalarioMinimoComponent from "@/components/contrato/salarioMinimo/ListarSalarioMinimoComponent.vue";
import SubirTarifasComponent from "@/components/contrato/contratos/SubirTarifasComponent.vue";
import FormTarifasComponent from "@/components/contrato/tarifas/FormTarifasComponent.vue";
import ListarGeoreferenciaComponent from "@/components/contrato/georeferencia/ListarGeoreferenciaComponent.vue";
import ListarDireccionamientoComponent from "@/components/contrato/direccionamiento/ListarDireccionamientoComponent.vue";
import ListarContratosPorPrestadorComponent from "@/components/contrato/contratos/ListarContratosPorPrestadorComponent.vue";
import ListarTarifasPorContratoComponent from "@/components/contrato/contratos/ListarTarifasPorContratoComponent.vue";
import ListarZonasComponent from "~/components/contrato/zonas/ListarZonasComponent.vue";

import { mapActions } from "vuex";
import ListaTarifasPorPrestadorComponent from "@/components/contrato/contratos/ListaTarifasPorPrestador.vue";

export default {

    middleware({ $can, redirect }) {
        if (!$can("contrato.contrato.vista")) {
            return redirect("/");
        }
    },

    components: {
        FormContratoComponent,
        AgregarCupsContratoComponent,
        AgregarCupsPropiosContratoComponent,
        FormPrestadorComponent,
        FormRepsComponent,
        ListarManualTarifarioComponent,
        ListarSalarioMinimoComponent,
        SubirTarifasComponent,
        FormTarifasComponent,
        AgregarPaqueteTarifaComponent,
        ListarGeoreferenciaComponent,
        ListarDireccionamientoComponent,
        ListarContratosPorPrestadorComponent,
        ListarTarifasPorContratoComponent,
        ListarContratosComponent,
        ListarZonasComponent
    },

    data() {
        return {
            rep: null,
            tab: "contratos",
            prestadores: [],
            widthContrato: "500px",
            editando: false,
            reps: [],
            preload: false,
            prestador: null,
            prestador_id: null,
            contrato_id: null,
            tarifa_id: null,
            rep_id: null,
            contratos: [],
            tarifas: [],
            file: null,
            nombreTarifa: null,
            valorTarifa: null,
            nombreContrato: null,
            headers: [
                { text: "Id", value: "id" },
                { text: "Tipo manual", value: "manual_tarifario.nombre" },
                { text: "Pleno", value: "pleno" },
                { text: "Tarifa", value: "valor" },
                { text: "Personas", value: "personas" },
                { text: "Estado", value: "activo" },
                { text: "Acciones", value: "acciones", sortable: false, align: 'center' },
            ],
            headersContratos: [
                { text: '# Contrato', value: 'id' },
                { text: 'Ambito', value: 'ambito.nombre' },
                { text: 'Entidad', value: 'entidad.nombre' },
                { text: 'Fecha termina', value: 'fecha_termina' },
                { text: 'PGP', value: 'PGP' },
                { text: 'Capitado', value: 'capitado' },
                { text: 'Evento', value: 'evento' },
                { text: 'Estado', value: 'activo' },
                { text: 'Acciones', value: 'actions', sortable: false, align: 'center' },
            ],
            dialogs: {
                contrato: false,
                cups: false,
                tarifas: false,
                propio: false,
                paquete: false,
                subirTarifa: false,
                erroresTarifas: false,
            },
            errorMessage: null,
            filtro: {
                rep_id: null,
                contrato_id: null,
            },
            timeout: null,
            bandera: true, // si esta en true el tipeo en el auto completar del prestador debe de buscar
        };
    },

    watch: {
        rep(val) {
            clearTimeout(this.timeout)
            if (val && this.bandera) {
                this.timeout = setTimeout(() => {
                    this.getPrestadores();
                }, 700)
            }
            this.bandera = true;
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        /**
         * Obtiene los prestadores
         */
        async getPrestadores() {
            try {
                const response = await this.$axios.get('/prestador/prestadoresContrato?filtro=' + this.rep)

                if (response.data.length < 1) {
                    throw new Error("Sin resultados");
                }

                this.prestadores = response.data.map((prestador) => {
                    return {
                        id: prestador.id,
                        nombre: `${prestador.nombre_prestador} - ${prestador.nit} - ${prestador.municipio.nombre} - ${prestador.municipio.departamento.nombre}`,
                    }
                })
            } catch (error) {
                console.error(error);
                this.$toast.info('Sin resultados')
            }
        },

        async getContratos() {
            try {
                this.preload = true;
                const { data } = await this.$axios.get(`/contrato?prestador_id=${this.prestador.id}`);
                console.log(data)
                this.contratos = data;
            } catch (error) {
                console.error(error);
                console.error(error.response);
                this.$toast.error("Error al obtener contratos");
            } finally {
                this.preload = false;
            }
        },

        async getTarifas() {
            this.preload = true;
            try {
                const res = await this.$axios.post('/tarifa/listar', this.filtro);
                this.tarifas = res.data.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.preload = false;
            }
        },

        async getSedes() {
            if (!this.prestador) return;
            this.preload = true;
            try {
                const formData = new FormData();
                formData.append("prestador_id", this.prestador.id);
                const res = await this.$axios.post("/reps/listar", formData);
                this.reps = res.data.map(rep => ({
                    id: rep.id,
                    nombre: `${rep.nombre} - ${rep.municipio.nombre}`,
                }));
            } catch (error) {
                console.error(error);
            } finally {
                this.preload = false;
            }
        },

        cerrarModalPrestador() {
            this.dialogs.prestador = false;
            this.editando = false;
            this.prestador = null;
            this.getPrestadores();
        },

        cerrarModalReps() {
            this.dialogs.reps = false;
            this.editando = false;
            this.rep_id = null;
        },

        abrirModalContrato(items) {
            this.editando = true;
            this.contrato_id = items.id;
            this.nombreContrato = `#${items.id} ${items.prestador.nombre_prestador} - ${items.prestador.departamento}`;
            this.widthContrato = "1500px";
            this.dialogs.contrato = true;
        },

        cerrarModalContratos() {
            this.dialogs.contrato = false;
            this.contrato_id = null;
            this.editando = false;
            this.getPrestadores();
            this.widthContrato = '500px';
        },

        abrirModalTarifas(item) {
            this.dialogs.tarifas = true;
            this.prestador_id = item.prestador_id;
            this.contrato_id = item.id;
        },

        abrirModalTarifaEditar(item) {
            this.dialogs.tarifas = true;
            this.editando = true;
            this.prestador_id = item.prestador_id;
            this.tarifa_id = item.id;
        },

        cerrarModalTarifas() {
            this.dialogs.tarifas = false;
            this.editando = false;
            this.prestador_id = null;
            this.contrato_id = null;
            this.tarifa_id = null;
            this.getTarifas();
        },

        formatearValor(item) {
            if (!item.valor) return "0";
            if ([6, 4, 5].includes(item.manual_tarifario_id)) {
                return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.valor);
            }
            return `${item.valor}%`;
        },

        limpiar() {
            this.filtro.rep_id = null;
            this.filtro.contrato_id = null;
            this.tarifas = [];
        },

        abrirModalCups(item) {
            this.tarifa_id = item.id;
            this.nombreTarifa = item.manual_tarifario.nombre;
            this.valorTarifa = item.manual_tarifario_id === 6 || item.manual_tarifario_id === 4 || item.manual_tarifario_id === 5
                ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.valor)
                : `${item.valor}%`;
            this.editando = true;
            this.dialogs.cups = true;
        },

        cerrarModalCups() {
            this.dialogs.cups = false;
            this.editando = false;
            this.tarifa_id = null;
        },

        abrirModalPropios(item) {
            this.dialogs.propio = true;
            this.editando = true;
            this.tarifa_id = item.id;
        },

        abrirModalPaquete(item) {
            this.dialogs.paquete = true;
            this.editando = true;
            this.tarifa_id = item.id;
        },

        subirTarifa(item) {
            this.tarifa_id = item.id;
            this.dialogs.subirTarifa = true;
        },

        manejoError() {
            this.errorMessage = "";
        },

        async cargarArchivo() {
            if (!this.file) {
                this.$toast.error("El archivo de carga es requerido");
                return;
            }
            this.preload = true;
            try {
                const formData = new FormData();
                formData.append("file", this.file);
                formData.append("tarifa_id", this.tarifa_id);
                const res = await this.$axios.post("/tarifa/subirArchivo", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    responseType: 'blob',
                });
                this.descargarArchivo(res.data, 'InformeErroresCarga.xlsx');
                this.dialogs.subirTarifa = false;
                this.file = null;
                this.$toast.success('Se cargaron exitosamente los Cups');
            } catch (error) {
                this.errorMessage = error.response.data.mensaje;
                console.error(error);
            } finally {
                this.preload = false;
            }
        },

        async descargarPlantillaCups() {
            this.preload = true;
            this.manejoError();
            try {
                const res = await this.$axios.get("/tarifa/descargarPlantillaCups", { responseType: 'blob' });
                this.descargarArchivo(res.data, 'PlantillaCups.xlsx');
            } catch (error) {
                this.errorMessage = error.response.data.mensaje;
                console.error(error);
            } finally {
                this.preload = false;
            }
        },

        descargarArchivo(blobData, fileName) {
            const blob = new Blob([blobData], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = fileName;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },

        cerrarSubirTarifa() {
            this.dialogs.subirTarifa = false;
            this.file = null;
        },

        async eliminarContrato(item) {
            this.preload = true;
            try {
                await this.$axios.post(`/contrato/eliminar/${item.id}`);
                this.getContratos();
                this.$toast.success('Se eliminó correctamente el contrato');
            } catch (error) {
                this.$toast.error(error.response.data.mensaje);
                console.error(error);
            } finally {
                this.preload = false;
            }
        },

        async eliminarTarifa(item) {
            this.preload = true;
            try {
                await this.$axios.post(`/tarifa/eliminar/${item.id}`);
                this.getTarifas();
                this.$toast.success('Se eliminó correctamente la tarifa');
            } catch (error) {
                this.$toast.error(error.response.data.mensaje);
                console.error(error);
            } finally {
                this.preload = false;
            }
        },

        /**
         * Esta funcion lo que hace es marcar una bandera
         * La bandera lo que hace es verificar si se debe de ejecutar el fetch o no, ya que con el change deberia no ejecutar de nuevo el watch
         */
        handleCambioPrestador() {
            this.bandera = false
        },

        actualizarDatos() {
            this.getContratos();
            this.getSedes();
            this.tarifas = [];
        },
    },
};
</script>
