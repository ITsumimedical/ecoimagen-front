<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Historias Clinicas</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>

                <div v-if="mostrarAutorizacion">

                    <v-alert dense text color="primary" icon="mdi-information-outline">
                        <b>informacion
                        </b>
                    </v-alert>

                    <p class="text-center text-h6"><b> De conformidad con lo previsto en la Ley 1581 de 2012</b> “por la
                        cual se dictan las
                        disposiciones
                        generales para la protección de datos personales” y el Decreto 1074 de 2015, autorizo libre,
                        expresa e inequívocamente A Sumimedical S.A.S Para que realice la recolección y tratamiento de
                        mis datos personales que suministro de manera veraz y completa, los cuáles serán utilizados para
                        la entrega de mi historia clínica en la base de datos de la que es responsable dicha
                        organización. <a
                            href="https://sumimedical.com/politica-de-privacidad-y-tratamiento-de-datos-personales/">https://sumimedical.com/politica-de-privacidad-y-tratamiento-de-datos-personales/</a>
                    </p>

                    <v-row>
                        <v-col cols="12" sm="12" md="12" class="d-flex align-center justify-center">
                            <v-radio-group v-model="primeraAutorizacion" row>
                                <v-radio label="Acepto términos y condiciones" :value="true" />
                                <v-radio label="No acepto" :value="false" />
                            </v-radio-group>
                        </v-col>

                    </v-row>



                    <v-divider></v-divider>

                    <p class="text-center text-h6 mt-3">
                        <b> De acuerdo con la Ley 23 de 1981 (Art. 34) - Resolución 1995 de 1999 (Art. 1) </b>“la
                        Historia
                        Clínica es un documento privado, obligatorio y sometido a reserva...”. Dicho documento
                        únicamente puede ser conocido por el mismo usuario o por terceros previa autorización del
                        paciente o en los casos previstos por la ley presenciales.
                    </p>

                    <v-row>
                        <v-col cols="12" sm="12" md="12" class="d-flex align-center justify-center">
                            <v-radio-group v-model="segundaAutorizacion" row>
                                <v-radio label="Acepto términos y condiciones" :value="true" />
                                <v-radio label="No acepto" :value="false" />
                            </v-radio-group>
                        </v-col>
                    </v-row>


                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="validarTelefono()" color="success" class="mt-43">
                            <v-icon small left>mdi-eye</v-icon> Ver mis Historias
                        </v-btn>
                    </v-card-actions>

                </div>

                <v-row v-if="historiasClinicas.length > 0">
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table :items="historiasClinicas" :headers="headersHistorias">
                            <template v-slot:[`item.fecha_atencion`]="{ item }">
                                <td v-if="item.cargue_historia_contingencia == null">
                                    {{ item.fecha_hora_inicio }}
                                </td>
                                <td v-else>
                                    {{ item.cargue_historia_contingencia.fecha_proceso }}
                                </td>
                            </template>
                            <template v-slot:[`item.afiliado`]="{ item }">
                                {{
                                    (item.afiliado.primer_nombre ?? '') + ' ' +
                                    (item.afiliado.segundo_nombre ?? '') + ' ' +
                                    (item.afiliado.primer_apellido ?? '') + ' ' +
                                    (item.afiliado.segundo_apellido ?? '')
                                }}
                            </template>

                            <template v-slot:[`item.medico`]="{ item }">
                                <td>
                                    {{ item.medico_ordena ? item.medico_ordena.operador.nombre_completo : "Sin Dato" }}
                                </td>
                            </template>

                            <template v-slot:[`item.nEspecialidad`]="{ item }">
                                <td v-if="item.cita_no_programada == true">
                                    {{ item.especialidad ? item.especialidad.nombre : "Sin Especialidad" }}
                                </td>
                                <td v-else-if="item.finalidad == 'Cargue historia contingencia'">
                                    {{ item.finalidad }}
                                </td>
                                <td v-else>
                                    {{ item.agenda ? item.agenda.cita.especialidad.nombre : "Sin Especialidad" }}
                                </td>
                            </template>

                            <template v-slot:[`item.tipo`]="{ item }">
                                <td v-if="item.cita_no_programada == true">
                                    {{ item.tipo_consulta.nombre }}
                                </td>
                                <td v-else-if="item.finalidad == 'Cargue historia contingencia'">
                                    {{ item.tipo_consulta.nombre }}
                                </td>
                                <td v-else>
                                    {{ item.agenda ? item.agenda.cita.nombre : "Sin Cita" }}
                                </td>
                            </template>


                            <template v-slot:[`item.acciones`]="{ item }">
                                <v-icon color="primary"
                                    @click="descargar(item.id, 'historia')">mdi-tray-arrow-down</v-icon>
                            </template>

                        </v-data-table>
                    </v-col>
                </v-row>

                <v-dialog v-model="modalFechaNacimiento" max-width="500">
                    <v-card>
                        <v-alert dense text color="red" icon="mdi-information-outline">
                            <b>Atencion
                            </b>
                        </v-alert>
                        <v-card-text>
                            <li class="text-center"><B>Por favor Diligencie su fecha de nacimiento para poder actualizar
                                    su informacion</B></li>
                            <v-row dense class="mt-4">
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field dne type="date" label="Fecha de nacimiento" outlined
                                        v-model="fechaIngresada" :rules="[rules.obligatorio]"></v-text-field>
                                </v-col>
                                <v-card-actions>
                                    <v-btn color="error" small @click="modalFechaNacimiento = false"> <v-icon small
                                            left>mdi-close</v-icon> Salir</v-btn>
                                    <v-btn dark small color="success" @click="actualizarInformacion()"><v-icon small
                                            left>mdi-content-save-check</v-icon> Enviar Fecha</v-btn>
                                </v-card-actions>
                            </v-row>
                        </v-card-text>
                    </v-card>

                </v-dialog>


            </v-card-text>
        </v-card>

        <v-dialog v-model="actualizarDatos" fullscreen>
            <v-card>

                <FormularioAfiliadoComponente :afiliado="datosAfiliado" :modoEdicion="true"
                    @cerrarModal="cerrarModal" />

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="cerrarModal()"><v-icon small
                            left>mdi-close</v-icon>cerrar</v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>

    </div>
</template>

<script>
import { mapActions } from "vuex";
import FormularioAfiliadoComponente from '../../components/afiliado/FormularioAfiliadoComponente.vue';
import ModalVistaBoletines from '../../components/inicio/modalVistaBoletines.vue';
export default {

    components: {
        FormularioAfiliadoComponente,
        ModalVistaBoletines
    },

    data() {
        return {
            segundaAutorizacion: false,
            primeraAutorizacion: false,
            modalFechaNacimiento: false,
            actualizarDatos: false,
            fechaIngresada: null,
            verHistorias: false,
            datosAfiliado: this.$store.state.auth.usuario.datosAfiliado,
            rules: {
                obligatorio: (v) => !!v || "Este campo es obligatorio ",
            },
            afiliado: {},
            codigoIngresado: null,
            historiasClinicas: [],
            headersHistorias: [{
                text: "F.Atención",
                align: "center",
                sortable: false,
                value: "fecha_atencion",
            },
            {
                text: "Afiliado",
                align: "center",
                sortable: false,
                value: "afiliado",
            },
            {
                text: "Atendido Por",
                align: "center",
                sortable: false,
                value: "medico",
            },
            {
                text: "Especialidad",
                align: "center",
                sortable: false,
                value: "nEspecialidad",
            },
            {
                text: "Tipo consulta",
                align: "center",
                sortable: false,
                value: "tipo",
            },
            {
                text: "Tipo archivo",
                align: "center",
                sortable: false,
                value: "cargue_historia_contingencia.tipo_archivo.nombre",
            },
            {
                text: "Acciones",
                align: "center",
                sortable: false,
                value: "acciones",
            },
            ],
            mostrarAutorizacion: true
        }
    },


    mounted() {
        this.buscarAfiliado();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        async buscarAfiliado() {
            try {
                this.setPreload(true)
                const res = await this.$axios.get(`afiliados/listarActivos/${this.$store.state.auth.usuario.datosAfiliado.numero_documento}/${this.$store.state.auth.usuario.datosAfiliado.tipo_documento}`);
                this.afiliado = res.data;
            } catch (error) {
                this.$toast.error('Ha ocurrido un error al buscar el Afiliado')
            } finally {
                this.setPreload(false)
            }
        },

        async validarTelefono() {
            if (this.primeraAutorizacion === false || this.segundaAutorizacion === false) {
                const res = await this.$swal({
                    title: "Señor Afiliado",
                    text: "¿Está seguro de no autorizar o no aceptar? No podrá continuar con la solicitud.",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonText: 'Si quiero autorizar',
                    cancelButtonText: 'Estoy seguro de no autorizar'
                });

                if (res.value) {
                    this.primeraAutorizacion = true;
                    this.segundaAutorizacion = true;
                } else {
                    await this.$swal({
                        title: "¡ Ups !",
                        text: "No fue posible continuar con la solicitud, por no aceptación de términos y autorizaciones",
                        type: "error",
                        confirmButtonText: "Aceptar"
                    });
                    return false
                }
            }

            if (this.afiliado.celular1 === null) {
                this.modalFechaNacimiento = true;
            } else {
                await this.enviarCodigoAfiliado();
                this.visualizarHistorias()
            }
        },

        actualizarInformacion() {

            const fechaIngresada = this.fechaIngresada;
            const fechaNacimientoAfiliado = this.datosAfiliado.fecha_nacimiento;

            if (fechaIngresada === fechaNacimientoAfiliado) {
                this.actualizarDatos = true;
            } else {
                this.$swal.fire({
                    title: '¡ Ups !',
                    text: 'La fecha que ingresaste no coincide con la que tenemos registrada. Si crees que es un error, te recomendamos revisar tus datos de afiliación con tu entidad aseguradora.',
                    type: 'warning'
                });
            }

        },

        actualizarDatosAfiliado() {
            this.modalFechaNacimiento = false;
            this.actualizarDatos = true;
        },

        async visualizarHistorias() {

            const { value: codigo, value } = await this.$swal.fire({
                title: 'Código de verificación',
                text: `Se ha enviado un código vía SMS a su teléfono ${this.censurarString(this.afiliado.celular1)} con vigencia de 10 minutos. Recuerde que para visualizar sus historias deberá proporcionar el código.`,
                input: 'text',
                inputPlaceholder: 'Ej: 123456',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Verificar',
                inputValidator: (value) => {
                    if (!value || value.trim() === '') {
                        return 'Debe ingresar un código válido';
                    }
                }
            });

            if (value) {
                this.codigoIngresado = codigo;
                this.afiliado = {}
                this.validarCodigo();
            }
        },

        censurarString(valor) {
            if (!valor || valor.length <= 4) {
                return valor
            }

            const longitud = valor.length;
            const censura = '*'.repeat(longitud - 4);
            return censura + valor.slice(-4);
        },

        cerrarModal() {
            this.actualizarDatos = false;
            this.modalFechaNacimiento = false;
            this.afiliado = {}
            this.buscarAfiliado();
        },

        async enviarCodigoAfiliado() {
            try {
                this.setPreload(true)
                await this.$axios.post(`/afiliados/generar-codigo-sms/${this.$store.state.auth.usuario.datosAfiliado.tipo_documento}/${this.$store.state.auth.usuario.datosAfiliado.numero_documento}`);
                this.$toast.success('¡ Se ha solicitado el envio del un codigo a su numero de celular !')
            } catch (error) {
                this.$toast.error('Ha ocurrido un error al enviar el Codigo')
            } finally {
                this.setPreload(false)
            }
        },

        async validarCodigo() {

            await this.buscarAfiliado();

            const codigo_sms = this.afiliado.notificacion_sms;

            if (codigo_sms === Number(this.codigoIngresado)) {
                this.consultarHistorias();
            } else {
                this.$swal.fire({
                    title: '¡ Ups !',
                    text: 'La codigo que ingresaste no coincide con la que hemos enviado a tu telefono .',
                    type: 'warning'
                });
                return false
            }

        },

        async consultarHistorias() {
            try {

                this.mostrarAutorizacion = false
                this.setPreload(true)

                const data = {
                    documento: this.$store.state.auth.usuario.datosAfiliado.numero_documento
                }

                const res = await this.$axios.post('historia/consultas', data);

                this.historiasClinicas = res.data.filter(
                    (historia) => historia.cargue_historia_contingencia?.tipo_archivo.id === 1
                )

            } catch (error) {
                this.$toast.error('Ha ocurrido un error al consultar las Historias Clinicas')
            } finally {
                this.setPreload(false)
            }
        },

        async descargar(id, tipo) {
            try {
                this.setPreload(true);
                const pdf = {
                    tipo: tipo,
                    consulta: id,
                };
                const res = await this.$axios.post("/pdf", pdf, {
                    responseType: "arraybuffer",
                });
                const blob = new Blob([res.data], { type: "application/pdf" });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error('Error al descargar la historia clinica');
            } finally {
                this.setPreload(false);
            }
        },
    }

}
</script>