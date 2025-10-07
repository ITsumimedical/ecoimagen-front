<template>
    <v-container fluid>


        <v-form v-model="esValido">
            <v-row dense>
                <!--Componente de busqueda de usuario-->
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

                <!--componente de datos del afiliado-->
                <v-col cols="12" md="12" sm="12" dense v-if="afiliado">
                    <EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                        :mostrarClasificaciones="true" />
                </v-col>

            </v-row>
            <!--Formulario de diligenciamiento de datos de acción constitucional-->
            <v-alert dense text border="left" icon="mdi-account" color="blue" class="mt-3"> Formulario </v-alert>

            <v-row dense>
                <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="tutelas.fecha_radica" label="Fecha radicado" type="date"
                        :error-messages="errors.fecha_radica" dense :rules="[validaciones.requerido]">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-text-field dense v-model="tutelas.radicado" label="Radicado largo"
                        :error-messages="errors.radicado" :rules="[validaciones.requerido]">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-text-field dense v-model="tutelas.radicado_corto" label="Radicado corto"
                        :error-messages="errors.radicado_corto" :rules="[validaciones.requerido]">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-text-field dense v-model="tutelas.direccion" label="Dirección" :error-messages="errors.direccion"
                        :rules="[validaciones.requerido]">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-autocomplete v-model="tutelas.municipio_id" :items="municipios" item-text="nombre"
                        item-value="id" dense label="Municipio" :error-messages="errors.municipio_id"
                        :rules="[validaciones.requerido]">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-text-field dense v-model="tutelas.telefono" label="Teléfono" type="number"
                        :error-messages="errors.telefono" :rules="[validaciones.requerido, validaciones.numero]">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-text-field dense v-model="tutelas.celular" label="Celular" type="number"
                        :error-messages="errors.celular">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-text-field dense v-model="tutelas.correo" label="Correo"
                        :rules="[validaciones.requerido, validaciones.email]" :error-messages="errors.correo">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-autocomplete dense v-model="tutelas.juzgado_id" :items="juzgados" item-text="nombre"
                        item-value="id" label="Juzgado" :error-messages="errors.juzgado_id"
                        :rules="[validaciones.requerido]">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-autocomplete v-model="tutelas.continuidad" :items="continuidades" label="Continuidad" dense
                        :error-messages="errors.continuidad" :rules="[validaciones.requerido]">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-autocomplete v-model="tutelas.exclusion" :items="exclusiones" label="Exclusión"
                        :error-messages="errors.exclusion" dense :rules="[validaciones.requerido]">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-autocomplete v-model="tutelas.integralidad" :items="exclusiones" label="Integralidad"
                        :error-messages="errors.integralidad" dense :rules="[validaciones.requerido]">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-autocomplete dense v-model="tutelas.tipo_actuacion_id" :items="tipoActuacion" item-text="nombre"
                        item-value="id" label="Tipo actuación" :error-messages="errors.tipo_actuacion_id"
                        :rules="[validaciones.requerido]">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                    <v-text-field v-model="tutelas.dias" label="Dias de respuesta" dense type="number"
                        :error-messages="errors.dias" :rules="[validaciones.requerido, validaciones.numero]">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="10">
                    <v-autocomplete dense deletable-chips small-chips chips v-model="tutelas.proceso_id" multiple
                        :items="procesoListar" item-text="nombre" item-value="id" label="Proceso"
                        :error-messages="errors.proceso_id">
                    </v-autocomplete>
                </v-col>
                <!-- tipo de servicios -->
                <v-col cols="12" sm="12" md="12">
                    <v-autocomplete deletable-chips small-chips dense v-model="tipo_servicio" :items="itemsTipoServicio"
                        chips label="Tipo de servicio" :error-messages="errors.tipo_servicio" multiple>
                    </v-autocomplete>
                </v-col>

                <!-- activar otros servicios -->
                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('OTROS')">
                    <v-combobox small-chips deletable-chips dense v-model="otro_tiposervicio" chips
                        label="Otros servicios" multiple>
                        <template v-slot:selection="{ attrs, item }">
                            <v-chip small v-bind="attrs" close @input="remover(item)">
                                {{ item }}&nbsp;
                            </v-chip>
                        </template>
                    </v-combobox>
                </v-col>
                <!-- activar novedades y registros -->
                <v-col cols="12" sm="12" md="12" v-if="ActivarCampos('NOVEDADES Y REGISTRO')">
                    <v-autocomplete :items="['AFILIACION', 'DESAFILIACION']" label="Novedades y registros" dense
                        required v-model="tutelas.novedad_registro"
                        :error-messages="errors.novedad_registro"></v-autocomplete>
                </v-col>
                <!-- activiar exclusion -->
                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('EXCLUSION')">
                    <v-autocomplete :items="exclusion" label="Exclusión" dense v-model="tutelas.exclusiones"
                        :error-messages="errors.exclusiones" chips multiple>
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('GESTION DOCUMENTAL')">
                    <v-autocomplete :items="gestionDocumental" dense label="Gestión documental" required
                        v-model="tutelas.gestion_documental"
                        :error-messages="errors.gestion_documental"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('SERVICIOS')">
                    <v-autocomplete dense :items="allCups" item-text="nombre" item-value="id" label="Servicios"
                        :search-input.sync="cup" v-model="cups" chips multiple>

                    </v-autocomplete>

                </v-col>

                <!-- activar medicamentos -->
                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('MEDICAMENTOS')">
                    <v-autocomplete :search-input.sync="FiltroCodesumis" :items="allMedicamentos"
                        item-text="codesumi.nombre" item-value="id" label="Medicamentos" v-model="medicamentos" dense
                        chips multiple deletable-chips no-data-text="Debe ingresar el nombre del insumo o medicamento">
                    </v-autocomplete>
                </v-col>
                <!-- Activar medicina laboral -->
                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('MEDICINA LABORAL')">
                    <v-autocomplete dense v-model="tutelas.medicina_laboral"
                        :items="['CALIFICACION PERDIDA CAPACIDAD', 'INCAPACIDAD MAXIMA', 'OTRO']"
                        label="Medicina laboral" :error-messages="errors.medicina_laboral">
                    </v-autocomplete>
                </v-col>

                <!-- activar otro de medicina laboral -->
                <v-col cols="12" sm="12" md="12"
                    v-show="ActivarCampos('MEDICINA LABORAL') && OtroMedicinalaboral('OTRO')">
                    <v-text-field dense v-model="tutelas.medicina_laboral" label="OTRO MEDICINA LABORAL" required>
                    </v-text-field>
                </v-col>


                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('HOSPITALIZACION')">
                    <v-text-field dense v-model="tutelas.hospitalizacion" label="Hospitalización" required>
                    </v-text-field>
                </v-col>

                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('REINTEGRO LABORAL')">
                    <v-text-field dense v-model="tutelas.reintegro_laboral" label="Reintegro laboral" required>
                    </v-text-field>
                </v-col>

                <!-- activiar reembolso -->
                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('REEMBOLSO')">
                    <v-autocomplete dense v-model="tutelas.reembolso"
                        :items="['TRANSPORTE', 'SERVICIOS', 'MEDICAMENTOS', 'OTRO']" label="REEMBOLSO" required>
                    </v-autocomplete>
                </v-col>

                <!-- activar otro reembolso -->
                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('REEMBOLSO') && OtroReembolso('OTRO')">
                    <v-text-field dense v-model="tutelas.reembolso" label="OTRO REEMBOLSO" required></v-text-field>
                </v-col>

                <!-- activar trasnporte -->
                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('TRANSPORTE')">
                    <v-autocomplete dense v-model="tutelas.transporte"
                        :items="['TRANSPORTE INTER URBANO', 'TRANSPORTE AEREO', 'TRANSPORTE FLUVIAL', 'TRANSPORTE TERRESTRE', 'OTRO']"
                        label="TRANSPORTE" required></v-autocomplete>
                </v-col>

                <!-- activar otro trasnporte -->
                <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('TRANSPORTE') && OtroTransporte('OTRO')">
                    <v-text-field dense v-model="tutelas.transporte" label="OTRO TRANSPORTE" required></v-text-field>
                </v-col>

                <v-col cols="12" sm="12" md="12">
                    <v-textarea auto-grow v-model="tutelas.observacion" outlined label="Observación"
                        :error-messages="errors.observacion">
                    </v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-file-input counter show-size truncate-length="10" v-model="adjuntos" small-chips multiple
                        outlined dense label="Adjuntar" accept=".jpg, .jpeg, .pdf">
                    </v-file-input>
                    <v-alert border="left" colored-border type="error" dense>
                        <small>Los archivos deben tener un tamaño máximo de 1GB<p> Extensiones
                                permitidas:<b><i>jpg,
                                        jpeg, pdf</i></b></p></small>
                    </v-alert>
                </v-col>
            </v-row>

            <!-- Boton de acciones de guardar y cancelar -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="error" @click="limpiardata(), $emit('respuestaComponente')">
                    Cancelar
                </v-btn>
                <v-btn small color="boton" dark @click="guardarTutela()">
                    Guardar
                </v-btn>
            </v-card-actions>

        </v-form>
    </v-container>
</template>

<script>
import {
    listarVademecum
} from "~/api/medicamentos/medicamento";
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";


export default {
    name: 'accionContitucionalComponente',
    components: {
        EditarAfiliadoComponente,
    },
    props: {
        documentos: Array
    },
    data: () => ({
        loading: false,
        preload: false,
        afiliados: [],
        municipios: [],
        afiliado: null,
        juzgados: [],
        allCups: [],
        cups: [],
        cup: null,
        cedula_paciente: null,
        medicamentos: [],
        allMedicamentos: [],
        medicinalaboralotro: null,
        reembolsotro: null,
        transporteotro: null,
        otro_tiposervicio: [],
        tipoActuacion: [],
        procesoListar: [],
        datosBasicos: false,
        editar: false,
        exclusiones: ['SI', 'NO'],
        continuidades: ['NUEVO', 'CONTINUIDAD'],
        tipoDocumento: [],
        responsables: [],
        FiltroCodesumis: null,
        exclusion: ['TRATAMIENTO INFERTILIDAD', 'TRATAMIENTO ESTETICO', 'TRATAMIENTO EXPERIMENTAL',
            'TRATAMIENTO MEDICO-QUIRURGICO REALIZADO EN EL EXTERIOR',
            'MEDICAMENTO NO AUTORIZADO POR INVIMA', 'TECNOLOGIA SIN EVIDENCIA CIENTIFICA', 'ORTODONCIA',
            'IMPLANTOLOGIA DENTAL',
            'DISPOSITIVO PROTESICO CAVIDAD ORAL', 'BLANQUEAMIENTO DENTAL',
            'INSTITUCIONES NO HABILITADAS EN SISTEMA DE SALUD',
            'ARTICULO SUNTUARIO', 'COSMETICOS', 'VITAMINAS', 'LIQUIDOS PARA LENTES DE CONTACTO',
            'TRATAMIENTO CAPILAR', 'SHAMPOO',
            'JABON', 'ENJUAGUE BUCAL', 'CREMA DENTAL', 'CEPILLO', 'SEDA DENTAL', 'ELEMENTOS DE ASEO', 'LECHES',
            'CREMA HIDRATANTE',
            'ANTISOLAR', 'DROGAS PARA LA MEMORIA', 'EDULCORANTES O SUSTITUTOS DE LA SAL', 'ANOREXIGENOS',
            'SERVICIOS FUERA DEL AMBITO DE SALUD',
            'CALZADO ORTOPEDICO', 'PAÑALES', 'TOALLAS HIGIENICAS'
        ],
        gestionDocumental: ['DERECHO DE PETICION NO CONTESTADO', 'SOLICITUD HISTORIA CLINICA'],
        tipoServicios: [],
        TipoAfiliado: [],
        tipo_servicio: [],
        medicinalaboral: [],
        reembolso: [],
        transporte: [],
        buscar: '',
        buscarAfiliado: null,
        dialogo: false,
        dialogoGestion: false,
        itemsAfiliado: {
            ut: null,
            tipo_documento: null,
            numero_documento: null,
            primer_nombre: null,
            primer_apellido: null,
        },
        novedadesregistro: null,
        gestiondocumental: null,
        tutelas: {
            fecha_radica: null,
            radicado: null,
            radicado_corto: null,
            direccion: null,
            municipio_id: null,
            telefono: null,
            celular: null,
            correo: null,
            juzgado_id: null,
            continuidad: null,
            exclusiones: [],
            exclusion: null,
            gestion_documental: null,
            integralidad: null,
            tipo_actuacion_id: null,
            dias: null,
            observacion: null,
            proceso_id: [],
            novedad_registro: null,
            medicina_laboral: null,
            transporte: null,
            reembolso: null,
            reintegro_laboral: null,
            hospitalizacion: null,

        },
        errors: {
            fecha_radica: null,
            radicado: null,
            radicado_corto: null,
            direccion: null,
            municipio_id: null,
            telefono: null,
            celular: null,
            observacion: null,
            correo: null,
            juzgado_id: null,
            continuidad: null,
            exclusiones: null,
            exclusion: null,
            gestion_documental: null,
            integralidad: null,
            tipo_actuacion_id: null,
            dias: null,
            proceso_id: null,
            novedad_registro: null,
            medicina_laboral: null,
            tipo_servicio: null
        },
        headers: [{
            text: 'id',
            align: 'start',
            sortable: false,
            value: 'id',
        },
        {
            text: 'Nombre',
            align: 'rigth',
            value: 'primer_nombre'
        },
        {
            text: 'Apellido',
            align: 'rigth',
            value: 'primer_apellido'
        },
        {
            text: 'Documento',
            align: 'rigth',
            value: 'numero_documento'
        },
        {
            text: 'Tipo afiliado',
            align: 'rigth',
            value: 'tipo_afiliado.nombre'
        },
        {
            text: 'Acciones',
            align: 'rigth',
            value: 'actions',
            sortable: false
        },
        ],
        headerCups: [{
            text: 'id',
            align: 'start',
            sortable: false,
            value: 'id',
        },
        {
            text: 'Cups',
            align: 'rigth',
            value: 'nombre'
        },
        {
            text: 'Eliminar',
            align: 'rigth',
            value: 'eliminar',
            sortable: false
        },
        ],
        cupsGuardados: [],
        adjuntos: [],
        tiposDocumentos: [],
        datosBuscarAfiliado: {
            numero_documento: null,
            tipo_documento: null,
        },
        validaciones: {
            email: v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'El correo debe ser válido',
            requerido: v => !!v || 'Este campo no puede estar vacío',
            minimo: v => /^.{1,5}$/.test(v) || 'El campo puede contener máximo 5 caracteres',


        },
        esValido: false,
    }),

    mounted() {
        this.listarMunicipio();
        this.listarjuzgados();
        this.listarActuacion();
        this.listarProcesos();
        this.listarTiposDocumentos();
    },

    watch: {
        cup(val) {
            if (val) {
                if (val.length > 4) {
                    this.getCups();
                }
            }
        },
        FiltroCodesumis(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarCodesumis();
                } else if (val.length < 4) {
                    this.allMedicamentos = null;
                }
            } else {
                this.allMedicamentos = null;
            }
        }
    },
    computed: {
        itemsTipoServicio() {
            let items = ['NOVEDADES Y REGISTRO', 'EXCLUSION', 'GESTION DOCUMENTAL', 'HOSPITALIZACION', 'SERVICIOS',
                'MEDICAMENTOS', 'MEDICINA LABORAL', 'REEMBOLSO', 'REINTEGRO LABORAL', 'TRANSPORTE', 'OTROS'
            ];

            if (this.tipo_servicio == []) return items

            return items
        },
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        listarTiposDocumentos() {
            (this.loading = true),
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
        addCups() {
            for (const key in this.cups) {
                this.cupsGuardados.push({
                    ...this.cups[key],
                });
            }
            this.cups = [];
            this.allCups = [];
        },

        guardarTutela() {
            this.limpiarError()
            if (this.esValido == false) {
                return this.$toast.error('Debe diligenciar los campos requeridos')
            }


            const formData = new FormData();
            formData.append(`radicado`, this.tutelas.radicado);
            formData.append(`radicado_corto`, this.tutelas.radicado_corto);
            formData.append(`municipio_id`, this.tutelas.municipio_id);
            formData.append(`juzgado_id`, this.tutelas.juzgado_id);
            // formData.append(`proceso_id`, this.tutelas.proceso_id);
            formData.append(`afiliado_id`, this.afiliado.id);
            // formData.append(`tipo_servicio`, this.tipo_servicio);
            formData.append(`observacion`, this.tutelas.observacion);
            formData.append(`transporte`, this.tutelas.transporte != null ? this.tutelas.transporte : '');
            formData.append(`reembolso`, this.tutelas.reembolso != null ? this.tutelas.reembolso : '');
            formData.append(`reintegro_laboral`, this.tutelas.reintegro_laboral != null ? this.tutelas.reintegro_laboral : '')
            formData.append(`hospitalizacion`, this.tutelas.hospitalizacion != null ? this.tutelas.hospitalizacion : '');
            formData.append(`medicina_laboral`, this.tutelas.medicina_laboral != null ? this.tutelas.medicina_laboral : '');
            formData.append(`gestion_documental`, this.tutelas.gestion_documental != null ? this.tutelas.gestion_documental : '');
            formData.append(`exclusion`, this.tutelas.exclusion);
            formData.append(`novedad_registro`, this.tutelas.novedad_registro != null ? this.tutelas.novedad_registro : '');

            formData.append(`dias`, this.tutelas.dias);
            formData.append(`tipo_actuacion_id`, this.tutelas.tipo_actuacion_id);
            formData.append(`integralidad`, this.tutelas.integralidad);
            formData.append(`continuidad`, this.tutelas.continuidad);
            formData.append(`correo`, this.tutelas.correo);
            formData.append(`celular`, this.tutelas.celular);
            formData.append(`telefono`, this.tutelas.telefono);
            formData.append(`direccion`, this.tutelas.direccion);
            formData.append(`fecha_radica`, this.tutelas.fecha_radica);




            if (this.tutelas.exclusiones.length > 0) {
                for (let i = 0; i < this.tutelas.exclusiones.length; i++) {
                    formData.append(`exclusiones[]`, this.tutelas.exclusiones[i]);
                }
            }
            if (this.tutelas.proceso_id.length > 0) {
                for (let i = 0; i < this.tutelas.proceso_id.length; i++) {
                    formData.append(`proceso_id[]`, this.tutelas.proceso_id[i]);
                }
            }
            if (this.medicamentos.length > 0) {
                for (let i = 0; i < this.medicamentos.length; i++) {
                    formData.append(`medicamentos[]`, this.medicamentos[i]);
                }
            }
            if (this.cups.length > 0) {
                for (let i = 0; i < this.cups.length; i++) {
                    formData.append(`cups[]`, this.cups[i]);
                }
            }
            for (let i = 0; i < this.adjuntos.length; i++) {
                formData.append(`adjuntos[]`, this.adjuntos[i]);
            }
            this.setPreload(true);

            this.$axios.post('/tutela/crear', formData).then(res => {
                this.setPreload(false);
                this.$toast.success(res.data.mensaje)

                this.$emit('respuestaComponente');
                this.limpiarError();
                this.limpiardata();

            }).catch(error => {
                this.setPreload(false);
                if (error.response.data.mensaje) {
                    this.$toast.error(error.response.data.mensaje)
                } else if (error.response.data) {
                    this.ErrorEntrada(error.response.data)
                }
            })
        },


        getCups() {
            this.preload = true;
            this.$axios
                .post(
                    "/cup/listar?page=0", {
                    cups: this.cup
                }
                )
                .then((res) => {
                    this.preload = false;
                    if (res.data.data.length >= 2) {
                        this.allCups = res.data.data.map((cup) => {

                            return {

                                id: cup.id,
                                nombre: cup.codigo_nombre,
                            }
                        })
                    } else if (res.data.data.length == 1) {
                        this.allCups = res.data.data.map((cup) => {
                            return {
                                id: cup.id,
                                nombre: cup.codigo_nombre,
                            }
                        })
                    }
                }).catch(e => {
                    this.preload = false;
                    console.log(e);
                })

        },

        consultarAfiliado() {

            this.setPreload(true);
            this.$axios
                .get(
                    `/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
                ).then((res) => {
                    this.afiliado = res.data;
                    this.tutelas.direccion = this.afiliado.direccion_residencia_cargue;
                    this.tutelas.telefono = this.afiliado.telefono;
                    this.tutelas.celular = this.afiliado.celular1;
                    this.tutelas.correo = this.afiliado.correo1;
                    this.tutelas.municipio_id = this.afiliado.municipio_atencion_id;

                }).catch(error => {
                    this.limpiardata()
                    this.$toast.error(error.response.data.error);
                    console.log(error)
                }).finally(() => {
                    this.setPreload(false);
                })
        },

        cerrar() {
            this.dialogo = false
            this.limpiardata()
        },

        marcarPaciente() {
            this.dialogo = true
        },
        limpiarAfiliado() {
            this.datosBuscarAfiliado = {
                numero_documento: null,
                tipo_documento: null,
            };
            this.afiliado = null;
        },

        limpiardata() {
            for (const key in this.itemsAfiliado) {
                this.itemsAfiliado[key] = ''
            }
            this.buscarAfiliado = null
            this.limpiarAfiliado()
            this.afiliado = ''
            this.medicamentos = []
            this.tipo_servicio = []
            this.cups = []
            for (const key in this.tutelas) {
                this.tutelas[key] = ''
            }
        },

        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',')
                }
            }
        },

        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = ''
            }
        },

        gestionTutela(item) {
            this.dialogoGestion = true
            this.itemsAfiliado = item
            this.tutelas.afiliado_id = item.id

        },

        actualizarAfiliado(id) {
            this.$axios.put('afiliado/' + id, this.editarusuario).then(res => {
                this.$toast.success(res.data.mensaje)
                this.dialogoEditar = false
            }).catch(error => {
                if (error.response.data.mensaje) {
                    this.$toast.error(error.response.data.mensaje)
                } else if (error.response.data) {
                    this.ErrorEntrada(error.response.data)
                }
            })
        },

        listarMunicipio() {
            this.$axios.get('/municipios/listar').then(res => {
                this.municipios = res.data
            }).catch(error => {
                console.log(error)
            })
        },

        listarjuzgados() {
            this.$axios.post('juzgado/listar').then(res => {
                this.juzgados = res.data
            }).catch(error => {
                console.log(error)
            })
        },

        listarProcesos() {
            this.loading = true
            this.$axios.get('proceso-tutela/listar').then(res => {
                this.procesoListar = res.data.data
                this.loading = false
            }).catch(error => {
                this.ErrorEntrada(error.response.data)
                this.loading = false
            })
        },

        /**
         * listar areas
         * @return objeto actuacionlistar
         * @author kobatime
         */
        listarActuacion() {
            this.loading = true
            this.$axios.get('tipo-actuacion').then(res => {
                this.tipoActuacion = res.data
                this.loading = false
            }).catch(error => {
                this.loading = false
            })
        },

        listartipoServicio() {
            this.$axios.get('/tipo-servicio/').then(res => {
                this.tipoServicios = res.data
            }).catch(error => {
                console.log(error)
            })
        },

        listarCodesumis() {
            this.preload = true;
            this.$axios.post('/medicamentos/listarVademecum', {
                nombre: this.FiltroCodesumis
            }).then(res => {
                this.allMedicamentos = res.data;
                this.preload = false;
            }).catch(e => {
                console.error(e.response);
                this.preload = false;
            });
        },

        ActivarCampos(msg) {
            let found = this.tipo_servicio.find(tipo => tipo == msg);
            if (found) return true;
            return false;
        },

        OtroMedicinalaboral(msg) {
            return this.medicinalaboral == msg || false;
        },

        OtroReembolso(msg) {
            return this.reembolso == msg || false;
        },

        OtroTransporte(msg) {
            return this.transporte == msg || false;
        },

        remover(item) {
            this.otro_tiposervicio.splice(this.otro_tiposervicio.indexOf(item), 1)
            this.otro_tiposervicio = [...this.otro_tiposervicio]
        },
        remove_responsable(item) {
            this.responsable.splice(this.responsable.indexOf(item), 1)
            this.responsable = [...this.responsable]
        },
        remover_servicio(item) {
            const index = this.tipo_servicio.indexOf(item)
            if (index >= 0) this.tipo_servicio.splice(index, 1)
        },
        remover_exclusiones(item) {
            const index = this.exclusiones.indexOf(item)
            if (index >= 0) this.exclusiones.splice(index, 1)
        },
        remover_cups(item) {
            const index = this.allCups.indexOf(item)
            if (index >= 0) this.allCups.splice(index, 1)
        },
        remove_medicamentos(item) {
            const index = this.allMedicamentos.indexOf(item)
            if (index >= 0) this.allMedicamentos.splice(index, 1)
        },

    }
}

</script>
