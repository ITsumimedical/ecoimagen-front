<template>
    <div>
        <component :is="comp" :datos="datosGenerales" @cerrar="cerrarHistoria" :ref="comp"></component>
        <!-- <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Tranquilo procesamos tu solicitud !
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog> -->

        <v-dialog v-model="modalCorreo" persistent max-width="500" v-if="modalCorreo">
            <v-card>
                <v-alert class="text-center" dense text color="primary" icon="mdi-book-open-page-variant"
                    border="bottom">
                    <b>Enviar historia al correo</b></v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="formCorreo.correo" label="Correo electrónico">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark small @click="
                        (modalCorreo = false),
                        (formCorreo.correo = ''),
                        (consultaCorreo = '')
                        ">Cerrar</v-btn>
                    <v-btn color="success" dark small @click="enviarCorreo()" :loading="loadingCorreo">Enviar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modalInasistir" persistent max-width="800px" v-if="modalInasistir">
            <v-card>
                <v-alert class="text-center" dense text type="info" icon="mdi-book-open-page-variant">
                    <b>Inasistir</b></v-alert>
                <v-card-text>
                    <v-form ref="formInadecuar">
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea dense auto-grow v-model="formInadecuar.motivo_inadecuacion"
                                    label="Motivo de inasistencia" :rules="[
                                        () =>
                                            !!formInadecuar.motivo_inadecuacion ||
                                            'Este campo es requerido',
                                        () =>
                                            formInadecuar.motivo_inadecuacion.length >= 10 ||
                                            'Este campo debe tener al menos 10 caracteres',
                                    ]">
                                </v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark small @click="modalInasistir = false">Cerrar</v-btn>
                    <v-btn color="success" dark small @click="inasistir()">Inasistir</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-divider></v-divider>
        <v-container>
            <v-row dense>
                <v-col cols="12" sm="6" md="6">
                    <v-spacer></v-spacer>
                    <v-text-field hint="Puede buscar por cualquier columna de la tabla" persistent-hint v-model="search"
                        append-icon="mdi-magnify" label="Buscar" single-line hide-details>
                    </v-text-field>
                </v-col>
            </v-row>
        </v-container>
        <!-- ATENCION OCUPACIONAL -->
        <v-data-table dense :headers="headers" :items="citas" :items-per-page="5"
            no-data-text="Aún no hay citas agendadas">
            <template v-slot:[`item.afiliado`]="{ item }">
                {{ item.afiliado?.primer_nombre }}
                {{ item.afiliado?.segundo_nombre }}
                {{ item.afiliado?.primer_apellido }}
                {{ item.afiliado?.segundo_apellido }}
            </template>
            <template v-slot:[`item.tipoDocumentoAfiliado`]="{ item }">
                {{ item.agenda.afiliados[0].tipo_documento }}
            </template>
            <template v-slot:[`item.documentoAfiliado`]="{ item }">
                {{ item.agenda.afiliados[0].numero_documento }}
            </template>
            <template v-slot:[`item.sexoAfiliado`]="{ item }">
                {{ item.agenda.afiliados[0].sexo }}
            </template>
            <template v-slot:[`item.edadAfiliado`]="{ item }">
                {{ item.agenda.afiliados[0].edad_cumplida }}
            </template>
            <template v-slot:[`item.sedeAfiliado`]="{ item }">
                {{ item.agenda.afiliados[0].ips }}
            </template>
            <template v-slot:[`item.especialidad`]="{ item }">
                {{ item.agenda.cita.especialidad.nombre }}
            </template>
            <template v-slot:[`item.actividad`]="{ item }">
                {{ item.actividad }}
            </template>
            <template v-slot:[`item.estado`]="{ item }">
                <v-chip small v-if="item.estado_id == 13" :color="getColor(item.estado_id)" dark>
                    {{ "Por confirmar" }}
                </v-chip>
                <v-chip small v-if="item.estado_id == 14" :color="getColor(item.estado_id)" dark>
                    {{ "Confirmada" }}
                </v-chip>
                <v-chip small v-if="item.estado_id == 7" :color="getColor(item.estado_id)" dark>
                    {{ "En consulta" }}
                </v-chip>
                <v-chip small v-if="item.estado_id == 8" :color="getColor(item.estado_id)" dark>
                    {{ "Inasistido" }}
                </v-chip>
                <v-chip small v-if="item.estado_id == 9" :color="getColor(item.estado_id)" dark>
                    {{ "Atendido" }}
                </v-chip>
                <v-chip small v-if="item.estado_id == 59" :color="getColor(item.estado_id)" dark>
                    {{ "Confirmado call center" }}
                </v-chip>
                <v-chip small v-if="item.estado_id == 67" :color="getColor(item.estado_id)" dark>
                    {{ "Confirmado por whatsapp" }}
                </v-chip>
            </template>
            <template v-slot:[`item.marcacionAfiliado`]="{ item }">
                <ClasificacionAfiliadoComponente :item="item" />
            </template>
            <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip bottom v-if="item.estado_id != 9 && item.estado_id != 8">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="success" v-on="on" v-bind="attrs" @click="generarHistoria(item)">
                            <v-icon>mdi-account-check</v-icon>
                        </v-btn>
                    </template>
                    <span>Atender</span>
                </v-tooltip>

                <v-tooltip bottom v-if="item.estado_id == 9">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="success" v-on="on" v-bind="attrs" @click="printCertificadoMedico(item.id)">
                            <v-icon>mdi-printer</v-icon>
                        </v-btn>
                    </template>
                    <span>Imprimir Certificado Consulta</span>
                </v-tooltip>

                <v-tooltip bottom v-if="item.estado_id != 9 && item.estado_id != 8">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="red" v-on="on" v-bind="attrs" @click="abrirModalInasistir(item.id)">
                            <v-icon>mdi-account-remove</v-icon>
                        </v-btn>
                    </template>
                    <span>Inasistir</span>
                </v-tooltip>

                <v-tooltip bottom v-if="item.estado_id == 9">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="info" v-on="on" v-bind="attrs" @click="print(item.id)">
                            <v-icon>mdi-printer</v-icon>
                        </v-btn>
                    </template>
                    <span>Imprimir historia</span>
                </v-tooltip>

                <v-tooltip bottom v-if="item.estado_id == 9">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="warning" v-on="on" v-bind="attrs" @click="abrirModalCorreo(item.id)">
                            <v-icon>mdi-email-check</v-icon>
                        </v-btn>
                    </template>
                    <span>Enviar al correo</span>
                </v-tooltip>
            </template>
        </v-data-table>
    </div>
</template>
<script>
// import ordenamiento from "~/components/ordenamiento/ordenamiento";
// import diagnosticos from "../../components/historia/diagnosticos/diagnosticos"
// import antecedentesGlobales from "~/components/historia/antecedentesHistoria/AntecedentesComponent";
// import antecedentesPersonales from "~/components/historia/antecedentesHistoria/AntecedentesPersonalesComponent";
// import antecedentesFamiliares from "~/components/historia/antecedentesHistoria/AntecedentesFamiliaresComponent";
import HistoriaIntegral from "~/components/panelMedico/historiaIntegral.vue";
import {
    mapActions
} from "vuex";
import ClasificacionAfiliadoComponente from "~/components/panelMedico/clasificacionAfiliadoComponente.vue"
export default {
    name: "atencionMedica",
    components: {
        // ordenamiento,
        // diagnosticos,
        // antecedentesGlobales,
        // antecedentesPersonales,
        // antecedentesFamiliares,
        HistoriaIntegral,
        ClasificacionAfiliadoComponente,
    },
    data() {
        return {
            comp: null,
            model: null,
            preload: false,
            fab: false,
            registroHistoria: {},
            datosGenerales: {},
            tituloHistoria: "",
            e6: 1,
            search: "",
            dialogHistoria: false,
            historia: [],
            headers: [{
                text: "id",
                sortable: false,
                value: "id",
            },
            {
                text: "Hora",
                sortable: false,
                value: "fecha_hora_inicio",
            },
            {
                text: "Paciente",
                sortable: false,
                value: "afiliado",
            },
            {
                text: "Tipo documento",
                sortable: false,
                value: "afiliado.tipo_documento.nombre",
            },
            {
                text: "Documento",
                sortable: false,
                value: "afiliado.numero_documento",
            },
            {
                text: "Sexo",
                sortable: false,
                value: "afiliado.sexo",
                align: "center",
            },
            {
                text: "Edad",
                sortable: false,
                value: "afiliado.edad_cumplida",
                align: "center",
            },
            {
                text: 'Marcación',
                sortable: false,
                value: 'marcacionAfiliado'
            },
            {
                text: "Sede",
                sortable: false,
                value: "nombreRep",
            },
            {
                text: "Especialidad",
                sortable: false,
                value: "cita.especialidad.nombre",
            },
            {
                text: "Actividad",
                sortable: false,
                value: "actividad",
            },
            {
                text: "Estado",
                sortable: false,
                value: "estado",
                align: "center",
            },
            {
                text: "Tiempo de consulta",
                sortable: false,
                value: "tiempo_consulta",
                align: "center",
            },
            {
                text: "Acciones",
                value: "acciones",
                align: "center",
            },
            ],
            citas: [],
            modalCorreo: false,
            formCorreo: {},
            consultaCorreo: "",
            modalInasistir: false,
            loadingCorreo: false,
            formInadecuar: {
                motivo_inadecuacion: "",
            },
            consultaInadecuar: "",
        };
    },
    created() {
        this.individualesCitas();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        individualesCitas() {
            this.setPreload(true);
            const data = {
                estados: [13, 14, 7, 9, 8],
            };
            this.$axios
                .post("/consultas/citasIndividales", data)
                .then((res) => {
                    this.citas = res.data;
                    this.setPreload(false);
                })
                .catch((err) => {
                    this.setPreload(false);
                });
        },

        getColor(estado_id) {
            if (estado_id == 5) return "brown";
            else if (estado_id == 8) return "red";
            else if (estado_id == 7) return "warning";
            else if (estado_id == 14) return "success";
            else if (estado_id == 9) return "blue";
            else if (estado_id == 59) return "success";
            else if (estado_id == 67) return "deep-purple darken-1";
            else return "orange";
        },

        generarHistoria(item) {
            const consultaId = item.id;
            this.$axios
                .get(`/consultas/verificarEstadoConsulta/${consultaId}`)
                .then((res) => {
                    if (res.data.estado_id === 13 || res.data.estado_id === 14 || res.data.estado_id === 59) {
                        this.enconsulta(item.id);
                    }
                });

            this.datosGenerales = item;
            this.comp = "HistoriaIntegral";
            this.$nextTick(() => {
                this.$refs.HistoriaIntegral.abrirDialog();
            })

            // this.tituloHistoria = item.agenda.cita.especialidad.nombre + " / " + item.agenda.cita.nombre;
            // this.$axios.get('/consultas/generarHistoria/' + item.agenda.cita_id).then(res => {
            //   this.historia = res.data.data.categorias_historia.sort((a, b) => a.orden - b.orden);
            //   this.dialogHistoria = true;
            // })
        },
        cerrarHistoria() {
            this.comp = null;
            this.individualesCitas();
        },

        siguienteCategoria(item, categoria) {
            const validate = this.$refs[categoria][0].validate();
            if (validate) {
                this.e6 =
                    parseInt(item) > this.historia.length ? this.historia.length : item;
            }
        },

        saltoCategoria(actual, siguiente) {
            console.log(actual, siguiente);
        },

        finalizarHistoria() {
            this.preload = true;
            this.$axios
                .post(
                    "/consultas/guardarHistoria/" + this.datosGenerales.id,
                    this.registroHistoria
                )
                .then((res) => {
                    this.preload = false;
                    this.dialogHistoria = false;
                    this.individualesCitas();
                })
                .catch((e) => {
                    this.preload = false;
                    this.$swal({
                        type: "error",
                        title: "¡No puede ser!",
                        text: e.response.data.mensaje,
                    });
                    for (const item in this.$refs) {
                        const validate = this.$refs[item][0].validate();
                        if (!validate) {
                            return (this.e6 = item);
                        }
                    }
                });
        },

        pausarConsulta() {
            this.dialogHistoria = false;
        },

        async print(pdf) {
            try {
                const request = {
                    consulta: pdf,
                    tipo: "historia",
                    correo: null,
                };
                this.preload = true;
                const res = await this.$axios.post("/pdf", request, {
                    responseType: "arraybuffer",
                });
                const blob = new Blob([res.data], {
                    type: "application/pdf",
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                console.log(error);
            } finally {
                this.preload = false;
            }
        },

        async printCertificadoMedico(pdf) {
            try {
                const request = {
                    consulta: pdf,
                    tipo: "certificadoAtencionMedica",
                    correo: null,
                };
                this.preload = true;
                const res = await this.$axios.post("/pdf", request, {
                    responseType: "arraybuffer",
                });
                const blob = new Blob([res.data], {
                    type: "application/pdf",
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                console.log(error);
            } finally {
                this.preload = false;
            }
        },

        abrirModalCorreo(consulta) {
            this.modalCorreo = true;
            this.consultaCorreo = consulta;
        },

        enviarCorreo() {
            var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (!regex.test(this.formCorreo.correo)) {
                return this.$swal.fire({
                    title: "Debe ingresar un Email valido",
                    icon: "warning",
                    type: "error",
                });
            }
            this.loadingCorreo = true;
            let pdf = {
                consulta: this.consultaCorreo,
                tipo: "historia",
                correo: this.formCorreo.correo,
            };
            // this.print(this.consultaCorreo,this.formCorreo.correo)
            this.$axios
                .post("pdf", pdf)
                .then((res) => {
                    this.loadingCorreo = false;
                    // this.emailEnvio = null;
                    this.formCorreo.correo = "";
                    this.consultaCorreo = "";
                    this.modalCorreo = false;
                    return this.$swal.fire({
                        title: "Historia enviada con exito!",
                        icon: "success",
                        type: "success",
                    });
                })
                .catch((err) => {
                    this.loadingCorreo = false;
                });
        },

        abrirModalInasistir(consulta) {
            this.modalInasistir = true;
            this.consultaInadecuar = consulta;
        },

        inasistir() {
            if (this.$refs.formInadecuar.validate()) {
                this.setPreload(true);
                this.formInadecuar.consulta = this.consultaInadecuar;
                this.$axios
                    .post("historia/inasistir", this.formInadecuar)
                    .then((res) => {
                        this.formInadecuar.motivo_inadecuacion = "";
                        this.consultaInadecuar = "";
                        this.modalInasistir = false;
                        this.setPreload(false);
                        this.individualesCitas();
                        return this.$swal.fire({
                            title: "Historia inasistida con exito!",
                            icon: "success",
                            type: "success",
                        });
                    })
                    .catch((err) => {
                        this.$toast.error("Ocurrió un error al inasistir la consulta");
                        console.log(err);
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            } else {
                return this.$toast.error("Debe agregar el motivo de inasistencia");
            }
        },

        enconsulta(consulta) {
            this.preload = true;

            this.$axios.post("historia/enconsulta/" + consulta).then((res) => { });
        },
    },
};

</script>
