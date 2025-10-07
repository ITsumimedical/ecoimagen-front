<template>
    <div>
        <v-data-table :headers="headersFaltantes" :items="logs" dense :page.sync="paginacion.current_page"
            :items-per-page="10" class="text-no-wrap" hide-default-footer :loading="loading.logs"
            @update:page="listarLogs">
            <!-- Mensaje si no hay datos -->
            <template v-slot:no-data>
                <v-alert type="warning" color="warning" class="ma-4">
                    Todas las citas han sido enviadas a Keiron.
                </v-alert>
            </template>

            <!-- Ícono de error -->
            <template v-slot:[`item.log_errores`]="{ item }">
                <td class="text-center">
                    <v-icon v-if="item.log_errores" @click="verDetallesErrores(item)" color="error">
                        mdi-alert-circle
                    </v-icon>
                </td>
            </template>

            <!-- Filtros y acciones -->
            <template v-slot:top>
                <v-row>
                    <v-col cols="12" md="8">
                        <v-text-field v-model="numero_documento" outlined dense label="Número Documento"
                            @keyup.enter="listarLogs(1)" />
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-btn color="warning" :disabled="!logs.length || loading.logs" :loading="loading.envioMasivo"
                            @click="enviarCitasMasivamente">
                            Enviar Citas Masivamente
                            <v-icon right>mdi-send</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </template>

            <!-- Paginación -->
            <template v-slot:footer>
                <div class="text-center mt-8">
                    <v-row>
                        <v-col cols="12" sm="11" md="11">
                            <v-pagination v-model="paginacion.pagina" :length="paginacion.total" :total-visible="9"
                                @input="listarLogs()">
                            </v-pagination>
                        </v-col>

                        <v-col cols="12" sm="1" md="1">
                            <v-select dense outlined v-model="paginacion.cantidadRegistros"
                                :items="[5, 10, 20, 50, 100]" label="Registros por Página"
                                @change="listarLogs()"></v-select>
                        </v-col>
                    </v-row>
                </div>
            </template>
        </v-data-table>
        <!-- Diálogo de detalles de error -->
        <v-dialog persistent v-model="dialogErrores" max-width="600px">
            <v-card>
                <v-alert dense text border="left" icon="mdi-clipboard-text" type="info" color="info">
                    <b>Detalles del Error</b>
                </v-alert>
                <v-card-text>
                    <span>Payload:</span>
                    <p class="error-text">{{ log_payload }}</p>
                    <span>Error:</span>
                    <p class="error-text">{{ errorLog }}</p>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="dialogErrores = false" color="error" small>
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    data() {
        return {
            loading: {
                logs: false,
                envioMasivo: false,
            },
            logs: [],
            dialogErrores: false,
            errorLog: "",
            log_payload: "",
            numero_documento: "",
            headersFaltantes: [
                { text: "N° Consulta", value: "id", sortable: false, align: "left" },
                {
                    text: "N° Documento",
                    value: "paciente_numero_documento",
                    sortable: false,
                    align: "left",
                },
                {
                    text: "Afiliado",
                    value: "paciente_nombre_completo",
                    sortable: false,
                    align: "left",
                },
                {
                    text: "Entidad",
                    value: "paciente_entidad_nombre",
                    sortable: false,
                    align: "left",
                },
                {
                    text: "Cita",
                    value: "cita_nombre",
                    sortable: false,
                    align: "left"
                },
                {
                    text: "Especialidad",
                    value: "especialidad_nombre",
                    sortable: false,
                    align: "left",
                },
                {
                    text: "Sede",
                    value: "sede_nombre",
                    sortable: false,
                    align: "left"
                },
                {
                    text: "Fecha Consulta",
                    value: "fecha_hora_inicio",
                    sortable: false,
                    align: "center",
                },
                {
                    text: "Error",
                    value: "log_errores",
                    sortable: false,
                    align: "center",
                },

            ],
            paginacion: {
                pagina: 1,
                cantidadRegistros: 10,
                total: 0,
            },
        };
    },

    mounted() {
        this.listarLogs();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        async listarLogs(page = 1) {
            this.loading.logs = true;
            try {
                const data = {
                    paginacion: this.paginacion,
                    estado_id: 13
                };
                const response = await this.$axios.post(`citas/listar-canceladas-faltantes-keiron`, data)
                this.logs = response.data.data;
                this.paginacion.total = response.data.last_page;
                this.$emit('canceladas', response.data.total);
            } catch (error) {
                this.$toast.error("Error al listar los logs");
            } finally {
                this.loading.logs = false;
            }
        },

        verDetallesErrores(item) {
            this.errorLog = item.log_errores;
            this.log_payload = item.log_payload;
            this.dialogErrores = true;
        },

        async enviarCitasMasivamente() {
            this.loading.envioMasivo = true;
            try {
                this.setPreload(true);
                await this.$axios.post("logs-keiron/envio-masivo-canceladas");
                this.$toast.success("canceladas enviadas exitosamente");
                this.listarLogs();
            } catch (error) {
                console.error(error);
                this.$toast.error("Error al enviar las citas");
            } finally {
                this.setPreload(false);
                this.loading.envioMasivo = false;
            }
        },
    },
};
</script>

<style scoped>
.error-text {
    background: #f8f9fa;
    padding: 8px;
    border-radius: 4px;
    white-space: pre-wrap;
    font-family: monospace;
}
</style>
