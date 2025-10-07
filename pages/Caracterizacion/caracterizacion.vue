<template>
    <div>
        <v-card elevation="0">

            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Caracterización</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formBuscarAfiliado">
                    <v-row class="mt-4">
                        <v-col cols="12" md="4" sm="12">
                            <v-autocomplete dense outlined label="Tipo de Documento" :items="tiposDocumentos"
                                :loading="loading.tiposDocumentos" no-data-text="No hay resultados" item-value="id"
                                item-text="nombre" v-model="datosBuscarAfiliado.tipo_documento"
                                hint="Ingresa el tipo de documento del afiliado" :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" md="4" sm="12">
                            <v-text-field dense outlined label="Número Documento" @keyup.enter="
                                consultarAfiliado(
                                    datosBuscarAfiliado.numero_documento,
                                    datosBuscarAfiliado.tipo_documento
                                )
                                " v-model.trim="datosBuscarAfiliado.numero_documento"
                                hint="Ingresa el número de documento del afiliado" :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
                            <v-btn color="primary" dark @click="
                                consultarAfiliado(
                                    datosBuscarAfiliado.numero_documento,
                                    datosBuscarAfiliado.tipo_documento
                                )
                                " style="width: 49%">Consultar <v-icon right>mdi-magnify</v-icon>
                            </v-btn>
                            <v-btn color="red" dark @click="limpiarAfiliado()" style="width: 49%">Limpiar<v-icon
                                    right>mdi-close
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <!-- Modal Caracterización -->
            <v-dialog v-model="modalCaracterizacion" max-width="1600px" persistent>
                <v-card flat>
                    <v-alert text dense border="left" type="info"
                        icon="mdi-card-account-details-outline"><b>Caracterización</b>
                    </v-alert>
                    <v-card-text>
                        <v-row v-if="afiliado">
                            <v-col cols="12" sm="12" md="12">
                                <EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                                    :mostrarClasificaciones="true" />
                            </v-col>
                        </v-row>
                        <v-form ref="formularioCaracterizacion" @submit.prevent="enviarFormulario" class="mt-2">
                            <v-row dense v-if="afiliado">
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert text dense border="left" color="green darken-1"
                                        icon="mdi-file-sign"><b>Información
                                            Caracterización</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-select dense
                                        label="¿Usted ha presentado reacciones alérgicas a las vacunaciones?"
                                        v-model="afiliado.caracterizacion_afiliado.reaccion_alergica"
                                        :items="opcionesSiNo"></v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-select dense label="¿Usted ha sido vacunado contra el COVID-19?"
                                        v-model="afiliado.caracterizacion_afiliado.vacunado_covid"
                                        :items="opcionesSiNo"></v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense label="Ocupación u Oficio"
                                        v-model="afiliado.caracterizacion_afiliado.ocupacion" :items="opcionesOcupacion"
                                        :rules="[
                                            () =>
                                                !!afiliado.caracterizacion_afiliado.ocupacion ||
                                                'Este campo es requerido',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense label="Nivel Escolar"
                                        v-model="afiliado.caracterizacion_afiliado.nivel_escolar"
                                        :items="opcionesNivelEscolar" :rules="[
                                            () =>
                                                !!afiliado.caracterizacion_afiliado.nivel_escolar ||
                                                'Este campo es requerido',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="afiliado.parentesco" readonly
                                        label="Parentesco del cuidador">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense label="Orientacion Sexual"
                                        v-model="afiliado.caracterizacion_afiliado.orientacion_sexual"
                                        :items="opcionesOrientacionSexual" :rules="[
                                            () =>
                                                !!afiliado.caracterizacion_afiliado.orientacion_sexual ||
                                                'Este campo es requerido',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense label="Tipo de Vivienda"
                                        v-model="afiliado.caracterizacion_afiliado.tipo_vivienda"
                                        :items="opcionesTipoVivienda" :rules="[
                                            () =>
                                                !!afiliado.caracterizacion_afiliado.tipo_vivienda ||
                                                'Este campo es requerido',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="afiliado.caracterizacion_afiliado.cantidad_personas_vive
                                        " type="number" label="¿Cuantos miembros conforman el hogar? (Personas con las que vive)">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense label="Estrato" v-model="afiliado.caracterizacion_afiliado.estrato_socioeconomico
                                        " :items="opcionesEstratoSocioeconomico"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense label="En su hogar ¿Cuenta con agua potable y alcantillado?"
                                        v-model="afiliado.caracterizacion_afiliado.agua_alcantarillado
                                            " :items="opcionesSiNo"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense
                                        label="La preparación de alimentos en su hogar se realiza con:"
                                        v-model="afiliado.caracterizacion_afiliado.metodo_cocina"
                                        :items="opcionesCocina" :rules="[
                                            () =>
                                                !!afiliado.caracterizacion_afiliado.metodo_cocina ||
                                                'Este campo es requerido',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense label="¿La vivienda cuenta con energía eléctrica?"
                                        v-model="afiliado.caracterizacion_afiliado.energia_electrica"
                                        :items="opcionesSiNo">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense label="Accesibilidad a la vivienda" v-model="afiliado.caracterizacion_afiliado.accesibilidad_vivienda
                                        " :items="opcionesAccesibilidadVivienda">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense label="Seguridad u Orden"
                                        v-model="afiliado.caracterizacion_afiliado.seguridad_orden"
                                        :items="opcionesSeguridadOrden">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense label="¿A que grupo étnico pertenece?"
                                        v-model="afiliado.caracterizacion_afiliado.etnia"
                                        :items="opcionesEtnia"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4" v-if="TamizajeProstata">
                                    <v-autocomplete dense :items="opcionesNoAplica"
                                        label="¿Se ha realizado tamizaje de cancér de prostata en los ultimos 5 años?"
                                        v-model="afiliado.caracterizacion_afiliado.tamizaje_prostata">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense :items="grupoRiesgo" label="Grupo de Riesgo"
                                        v-model="afiliado.caracterizacion_afiliado.grupo_riesgo">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete dense :items="estratificacionRiesgo"
                                        label="Estratificacion de Riesgo"
                                        v-model="afiliado.caracterizacion_afiliado.estratificacion_riesgo">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete :items="user_gestor" dense
                                        v-model="afiliado.caracterizacion_afiliado.user_gestor_id"
                                        label="Nombre del Gestor" :search-input.sync="campoBusquedaUsarioGestor"
                                        :loading="loading.gestor"
                                        no-data-text="Digite el nombre del gestor para buscar." item-text="nombre"
                                        item-value="id"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-autocomplete :items="user_enfermeria" dense
                                        v-model="afiliado.caracterizacion_afiliado.user_enfermeria_id"
                                        label="Nombre de Enfermeria" :search-input.sync="campoBusquedaUsuarioEnfermeria"
                                        :loading="loading.enfermeria" no-data-text="Digite el nombre para buscar."
                                        item-text="nombre" item-value="id"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" v-if="esMujer">
                                    <v-alert text dense border="left" color="green darken-1"
                                        icon="mdi-face-woman-shimmer">
                                        <b>Femenino</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="4" v-if="esMujer">
                                    <v-autocomplete dense label="Métodos de Planificación" :items="opcionesPlanifica"
                                        v-model="afiliado.caracterizacion_afiliado.metodo_planificacion
                                            "></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4" v-if="esMujer">
                                    <v-autocomplete dense
                                        label="¿Tiene planeado embarazo en un tiempo inferior a un año?"
                                        :items="opcionesNoAplica"
                                        v-model="afiliado.caracterizacion_afiliado.planeado_embarazo">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4" v-if="esMujer">
                                    <v-autocomplete dense label="¿Se ha realizado una citología en el último año?"
                                        v-model="afiliado.caracterizacion_afiliado.citologia_ultimo_ano
                                            " :items="opcionesNoAplica"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="4" v-if="MujerYEdad">
                                    <v-autocomplete dense label="¿Se ha realizado una mamografía en los últimos 2 años?"
                                        v-model="afiliado.caracterizacion_afiliado.tamizaje_mamografia
                                            " :items="opcionesNoAplica"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert text dense border="left" color="green darken-1"
                                        icon="mdi-close-circle-multiple">
                                        <b>Violencia</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-radio-group v-model="afiliado.caracterizacion_afiliado.tipo_violencia_id"
                                        :rules="[(v) => !!v || 'Debe seleccionar una respuesta']" dense row>
                                        <v-radio v-for="item in opcionesTipoViolencia" :key="item.id"
                                            :label="item.nombre" :value="item.id">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" sm="12" md="12"
                                    v-if="afiliado.caracterizacion_afiliado.tipo_violencia_id === 1">
                                    <v-autocomplete dense label="Tipo de Discapacidad" :items="opcionesDiscapacidad"
                                        v-model="afiliado.caracterizacion_afiliado.discapacidad"
                                        :rules="[(v) => !!v || 'Este campo es requerido']">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert text dense border="left" color="green darken-1"
                                        icon="mdi-bottle-tonic-plus-outline">
                                        <b>Prácticas que Intervienen en el Cuidado de la Salud</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete dense multiple small-chips deletable-chips clearable
                                        label="Seleccione una o más opciones"
                                        v-model="afiliado.caracterizacion_afiliado.practica"
                                        :items="opcionesPracticasIntervienenSalud"
                                        :loading="loading.practicas_intervienen_salud" :rules="[(v) =>
                                            (!!v && v.length > 0) ||
                                            'Debe seleccionar al menos una opción',]" item-text="nombre" item-value="id">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert text dense border="left" color="green darken-1"
                                        icon="mdi-emoticon-sick-outline">
                                        <b>Antecedentes de Cáncer</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-autocomplete dense multiple small-chips deletable-chips clearable
                                        label="En su familia existen antecedentes de Cáncer de:"
                                        v-model="afiliado.caracterizacion_afiliado.tipo_cancer_familia"
                                        :loading="loading.tipo_cancer" item-text="nombre" item-value="id"
                                        :items="opcionesTipoCancer" :rules="[
                                            (v) =>
                                                (!!v && v.length > 0) ||
                                                'Debe seleccionar al menos una opción',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-autocomplete dense multiple small-chips deletable-chips clearable
                                        label="Tiene usted antecedentes de Cáncer de:"
                                        v-model="afiliado.caracterizacion_afiliado.tipo_cancer_propio"
                                        :loading="loading.tipo_cancer" :items="opcionesTipoCancer" item-text="nombre"
                                        item-value="id" :rules="[
                                            (v) =>
                                                (!!v && v.length > 0) ||
                                                'Debe seleccionar al menos una opción',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert text dense border="left" color="green darken-1"
                                        icon="mdi-emoticon-sick-outline">
                                        <b>Antecedentes de Enfermedades Metabólicas</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-autocomplete dense multiple small-chips deletable-chips clearable
                                        label="¿En su familia existen antecedentes de Enfermedades Metabólicas?"
                                        v-model="afiliado.caracterizacion_afiliado.tipo_metabolica_familia"
                                        :loading="loading.tipo_metabolicas" item-text="nombre" item-value="id"
                                        :items="opcionesMetabolicas" :rules="[
                                            (v) =>
                                                (!!v && v.length > 0) ||
                                                'Debe seleccionar al menos una opción',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-autocomplete dense multiple small-chips deletable-chips clearable
                                        label="¿Tiene usted antecedentes de Enfermedades Metabólicas?"
                                        v-model="afiliado.caracterizacion_afiliado.tipo_metabolica_propio"
                                        :loading="loading.tipo_metabolicas" item-text="nombre" item-value="id"
                                        :items="opcionesMetabolicas" :rules="[
                                            (v) =>
                                                (!!v && v.length > 0) ||
                                                'Debe seleccionar al menos una opción',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert text dense border="left" color="green darken-1"
                                        icon="mdi-emoticon-sick-outline">
                                        <b>Antecedentes de Enfermedades de Riesgo Cardiovascular</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete dense multiple small-chips deletable-chips clearable
                                        label="¿Tiene usted antecedentes de Enfermedades de Riesgo Cardiovascular?"
                                        v-model="afiliado.caracterizacion_afiliado.tipo_r_c_v" :items="opcionesRCV"
                                        :loading="loading.tipo_rcv" item-text="nombre" item-value="id" :rules="[
                                            (v) =>
                                                (!!v && v.length > 0) ||
                                                'Debe seleccionar al menos una opción',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert text dense border="left" color="green darken-1"
                                        icon="mdi-emoticon-sick-outline">
                                        <b>Antecedentes de Enfermedades Respiratorias</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete dense multiple small-chips deletable-chips clearable
                                        label="¿Tiene usted antecedentes de Enfermedades Respiratorias?"
                                        v-model="afiliado.caracterizacion_afiliado.tipo_respiratoria"
                                        :items="opcionesRespiratoria" :loading="loading.tipo_respiratorias"
                                        item-text="nombre" item-value="id" :rules="[
                                            (v) =>
                                                (!!v && v.length > 0) ||
                                                'Debe seleccionar al menos una opción',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert text dense border="left" color="green darken-1"
                                        icon="mdi-emoticon-sick-outline">
                                        <b>Antecedentes de Enfermedades de Inmunodeficiencia</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete dense multiple small-chips deletable-chips clearable
                                        label="¿Tiene usted antecedentes de Enfermedades de Inmunodeficiencia?"
                                        v-model="afiliado.caracterizacion_afiliado.tipo_inmunodeficiencia"
                                        :items="opcionesInmunodeficiencia" :loading="loading.tipo_inmunodeficiencia"
                                        item-text="nombre" item-value="id" :rules="[
                                            (v) =>
                                                (!!v && v.length > 0) ||
                                                'Debe seleccionar al menos una opción',
                                        ]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert text dense border="left" color="green darken-1"
                                        icon="mdi-account-group-outline">
                                        <b>Otras condiciones de Riesgo</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete label="Seleccione una o más opciones"
                                        :items="opcionesOtrasCondicionesRiesgo" multiple small-chips deletable-chips
                                        clearable item-text="nombre" item-value="id"
                                        :loading="loading.condiciones_riesgo" :rules="[(v) =>
                                            (!!v && v.length > 0) ||
                                            'Debe seleccionar al menos una opción',]"
                                        v-model="afiliado.caracterizacion_afiliado.condicion_riesgo">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert text dense border="left" color="green darken-1" icon="mdi-account-child">
                                        <b>Ruta de Promoción y Mantenimiento</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete v-model="afiliado.caracterizacion_afiliado.ruta_promocion"
                                        label="Seleccione una o más opciones" :rules="[(v) =>
                                            (!!v && v.length > 0) ||
                                            'Debe seleccionar al menos una opción',]" :items="opcionesRutaPromocion" multiple small-chips
                                        deletable-chips clearable item-text="nombre" :loading="loading.ruta_promocion"
                                        item-value="id">
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" @click="cerrarModal()">Cerrar</v-btn>
                        <v-btn small color="success" @click="enviarFormulario()">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>

<script>
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import buscarActualizarAfiliado from "@/components/aseguramiento/afiliados/buscarActualizarAfiliado.vue";

export default {
    components: {
        EditarAfiliadoComponente,
        buscarActualizarAfiliado
    },
    data() {
        return {
            preload: false,
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
            tiposDocumentos: [],
            afiliado: null,
            rules: {
                obligatorio: (value) => !!value || "Este campo es obligatorio.",
            },
            user_gestor: [],
            user_enfermeria: [],
            loading: {
                gestor: false,
                enfermeria: false,
                tipo_cancer: false,
                tipo_metabolicas: false,
                tipo_rcv: false,
                tipo_respiratorias: false,
                tipo_inmunodeficiencia: false,
                practicas_intervienen_salud: false,
                condiciones_riesgo: false,
                ruta_promocion: false,
            },
            afiliado: null,
            modalCaracterizacion: false,
            datosBasicos: true,
            editar: true,
            opcionesTipoViolencia: [],
            opcionesPracticasIntervienenSalud: [],
            opcionesOtrasCondicionesRiesgo: [],
            opcionesRutaPromocion: [],
            opcionesSiNo: ["SI", "NO"],
            opcionesTipoVivienda: ["URBANA", "RURAL"],
            opcionesOcupacion: [
                "ESTUDIANTE",
                "AMA DE CASA",
                "PENSIONADO",
                "DOCENTE",
                "DESEMPLEADO",
                "EMPRESARIO",
                "TRABAJADOR INDEPENDIENTE",
                "EMPLEADO",
                "OTRO",
            ],
            opcionesNivelEscolar: [
                "PRIMARIA",
                "BACHILLER",
                "TÉCNICO",
                "TECNÓLOGO",
                "PREGRADO",
                "POSGRADO",
                "OTRO",
            ],
            estratificacionRiesgo: [
                'ALTO RIESGO',
                'ALTA COMPLEJIDAD',
                'PACIENTE SANO',
                'MUY ALTA COMPLEJIDAD',
                'BAJO RIESGO',
                'SD',
                'EPILEPSIA',
                'ANEMIA',
                'DISLIPIDEMIA',
                'VIOLENCIA',
                'ASMA',
                'TRASTORNOS AUDITIVOS',
                'TRASTORNOS VISUALES',
                'ALTERACIONES DE LA COAGULACION',
                'ENFERMEDADES MENTALES',
                'PSICOSOCIALES Y DEL COMPORTAMIENTO',
                'ENFERMEDADES RARAS',
                'ENFERMEDADES HUERFANAS',
                'TRASPLANTES, ENFERMEDADES AUTOINMUNES',
                'APNEA',
                'VIH',
                'TRASTORNOS DEGENERATIVOS Y NEUROPATIAS'
            ],
            grupoRiesgo: [
                'DIABETES',
                'HIPERTENSION ARTERIAL',
                'TRASTORNOS AUDITIVOS',
                'PATOLOGIAS CARDIACAS',
                'EPOC',
                'OXIGENOREQUIRENTES',
                'ARTRITIS REUMATOIDE',
                'ENFERMEDADES MENTALES',
                'PSICOSOCIALES Y DEL COMPORTAMIENTO',
                'CANCER',
                'OBESIDAD',
                'ERC',
                'EPILEPSIA',
                'ANEMIA',
                'DISLIPIDEMIA',
                'VIOLENCIA',
                'ASMA',
                'TRASTORNOS VISUALES',
                'RUTA PYM RES 3280',
                'ALTERACIONES DE LA COAGULACION',
                'ENFERMEDADES RARAS',
                'ENFERMEDADES HUERFANAS',
                'TRASPLANTES',
                'ENFERMEDADES AUTOINMUNES',
                'APNEA',
                'VIH',
                'TRASTORNOS DEGENERATIVOS Y NEUROPATIAS',
                'HIPERTENSION ARTERIAL|DISLIPIDEMIA|EPOC',
                'HIPERTENSION ARTERIAL|EPILEPSIA|EPOC',
                'HIPERTENSION ARTERIAL|VIOLENCIA, HIPERTENSION ARTERIAL|TRASTORNOS AUDITIVOS',
                'HIPERTENSION ARTERIAL|TRASTORNOS VISUALES',
                'HIPERTENSION ARTERIAL|OBESIDAD',
                'HIPERTENSION ARTERIAL|ANEMIA|TRASTORNOS VISUALES'
            ],
            opcionesOrientacionSexual: [
                "HETEROSEXUAL",
                "HOMOSEXUAL",
                "BISEXUAL",
                "PANSEXUAL",
                "ASEXUAL",
                "NO DESEA CONTESTAR",
            ],
            opcionesEstratoSocioeconomico: [1, 2, 3, 4, 5, 6],
            opcionesCocina: [
                "GAS PIPETA",
                "GAS NATURAL",
                "ELÉCTRICA",
                "LEÑA",
                "COMBUSTIBLE",
                "OTRO",
            ],
            opcionesAccesibilidadVivienda: ["FÁCIL", "DIFÍCIL"],
            opcionesSeguridadOrden: ["BUENA", "REGULAR", "MALA"],
            opcionesEtnia: [
                "INDÍGENA",
                "AFRODESCENDIENTE",
                "RAIZAL (ARCHIPIÉLAGO DE SAN ANDRÉS)",
                "PALENQUERO (SAN BASILIO)",
                "ROM (GITANO)",
                "MULATO",
                "AFROCOLOMBIANO",
                "OTRO",
            ],
            opcionesNoAplica: ["SI", "NO", "NO APLICA"],
            opcionesPlanifica: [
                "ORAL",
                "DIU",
                "IMPLANTES SUBMERDICOS",
                "INYECTABLES MENSUALES",
                "INYECTABLES TRIMESTRALES",
                "BARRERAS (Preservático, Diafragma, etc)",
                "ANTICONCEPTIVO QUIRURGICA (Tubectomia, Vasectomia)",
                "NO VIDA SEXUAL",
                "NO PLANIFICA",
            ],
            opcionesDiscapacidad: [
                "FÍSICA",
                "AUDITIVA",
                "VISUAL",
                "INTELECTUAL",
                "SORDOCEGUERA",
                "MULTIPLE",
            ],
            opcionesTipoCancer: [],
            opcionesMetabolicas: [],
            opcionesRCV: [],
            opcionesRespiratoria: [],
            opcionesInmunodeficiencia: [],
            campoBusquedaUsarioGestor: null,
            campoBusquedaUsuarioEnfermeria: null,
        };
    },
    computed: {
        MujerYEdad() {
            return (
                this.afiliado.sexo === "F" &&
                this.afiliado.edad_cumplida >= 50 &&
                this.afiliado.edad_cumplida <= 69
            );
        },
        esMujer() {
            return this.afiliado.sexo === "F";
        },
        TamizajeProstata() {
            return (
                this.afiliado.sexo === "M" &&
                this.afiliado.edad_cumplida >= 50 &&
                this.afiliado.edad_cumplida <= 75
            );
        },

        afiliadoEdadEntre6y11() {
            return (
                this.afiliado.edad_cumplida >= 6 && this.afiliado.edad_cumplida <= 11
            );
        },
    },

    watch: {
        campoBusquedaUsarioGestor(newVal) {
            if (newVal && newVal.length === 6) {
                this.buscarUsuarios();
            }
        },
        campoBusquedaUsuarioEnfermeria(newVal) {
            if (newVal && newVal.length === 6) {
                this.buscarUsuariosEnfermeria();
            }
        },
    },

    created() {
        this.listarTiposDocumentos();
    },
    methods: {
        listarTiposDocumentos() {
            this.loading.tipo_documento = true;
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
                    this.loading.tipo_documento = false;
                });
        },
        consultarAfiliado() {
            if (
                this.datosBuscarAfiliado.numero_documento === null ||
                this.datosBuscarAfiliado.tipo_documento === null
            ) {
                return this.$toast.error(
                    "Por favor ingrese el tipo de documento y el número de documento."
                );
            }

            this.preload = true;
            this.$axios
                .get(
                    `/afiliados/buscarAfiliadoCaracterizacion/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
                )
                .then((res) => {
                    this.afiliado = res.data;

                    // Inicializa caracterizacion_afiliado si es null
                    if (!this.afiliado.caracterizacion_afiliado) {
                        this.afiliado.caracterizacion_afiliado = {
                            reaccion_alergica: null,
                            vacunado_covid: null,
                            ocupacion: null,
                            nivel_escolar: null,
                            orientacion_sexual: null,
                            tipo_vivienda: null,
                            cantidad_personas_vive: 0,
                            estrato_socioeconomico: null,
                            agua_alcantarillado: null,
                            metodo_cocina: null,
                            energia_electrica: null,
                            accesibilidad_vivienda: null,
                            seguridad_orden: null,
                            etnia: null,
                            tamizaje_prostata: null,
                            metodo_planificacion: null,
                            planeado_embarazo: null,
                            citologia_ultimo_ano: null,
                            tamizaje_mamografia: null,
                            tipo_violencia_id: null,
                            discapacidad: null,
                            practica: [],
                            tipo_cancer_familia: [],
                            tipo_cancer_propio: [],
                            tipo_metabolica_familia: [],
                            tipo_metabolica_propio: [],
                            tipo_r_c_v: [],
                            tipo_respiratoria: [],
                            tipo_inmunodeficiencia: [],
                            condicion_riesgo: [],
                            ruta_promocion: []
                        };
                    }

                    this.abrirDialogo();
                })
                .catch((error) => {
                    this.$toast.error(
                        "El afiliado no se encuentra registrado en la base de datos."
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        abrirDialogo() {
            this.listarTipoViolencia();
            this.listarPracticas();
            this.listarTipoCancer();
            this.listarTipoMetabolicas();
            this.listarTipoRCV();
            this.listarTipoRespiratorias();
            this.listarTipoInmunodeficiencias();
            this.listarOtrasCondicionesRiesgo();
            this.listarRutaPromocionCaracterizacion();
            this.modalCaracterizacion = true;
        },
        limpiarAfiliado() {
            this.datosBuscarAfiliado = {
                numero_documento: null,
                tipo_documento: null,
            };
            this.afiliado = null;
        },


        async buscarUsuariosEnfermeria() {
            try {
                this.loading.enfermeria = true;
                const response = await this.$axios.post(`/usuarios/busqueda-usuario`, { 'enfermeria': this.campoBusquedaUsuarioEnfermeria });
                this.user_enfermeria = response.data.map((user) => {
                    return {
                        id: user.id,
                        nombre: `${user.operador.nombre} ${user.operador.apellido}`,
                    };
                });
                if (this.user_enfermeria.length <= 0) {
                    this.$toast.error('No se han encontrado registros de usuarios con los criterios ingresados')
                }
            } catch (error) {
                this.$toast.error("Ocurrió un error al cargar los usuarios");
                this.$toast.error(error.response.data);
            } finally {
                this.loading.enfermeria = false;
            }
        },

        async buscarUsuarios() {
            try {
                this.loading.gestor = true;
                const response = await this.$axios.post(`/usuarios/busqueda-usuario`, { 'nombre': this.campoBusquedaUsarioGestor });
                this.user_gestor = response.data.map((user) => {
                    return {
                        id: user.id,
                        nombre: `${user.operador.nombre} ${user.operador.apellido}`,
                    };
                });
                if (this.user_gestor.length <= 0) {
                    this.$toast.error('No se han encontrado registros de usuarios con los criterios ingresados')
                }
            } catch (error) {
                this.$toast.error("Ocurrió un error al cargar los usuarios");
                this.$toast.error(error.response.data);
            } finally {
                this.loading.gestor = false;
            }
        },

        listarTipoViolencia() {
            this.preload = true;
            this.$axios
                .get("tipo-violencia/listarTodas")
                .then((res) => {
                    this.opcionesTipoViolencia = res.data;
                })
                .catch((e) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de violencia"
                    );
                    console.log(e);
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        listarPracticas() {
            this.loading.practicas_intervienen_salud = true;
            this.$axios
                .get("practica-interviene-salud/listarTodas")
                .then((res) => {
                    this.opcionesPracticasIntervienenSalud = res.data;
                })
                .catch((e) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar las practicas que intervienen en la salud"
                    );
                    console.log(e);
                })
                .finally(() => {
                    this.loading.practicas_intervienen_salud = false;
                });
        },

        listarTipoCancer() {
            this.loading.tipo_cancer = true;
            this.$axios
                .get("tipo-cancer-caracterizacion/listarTodas")
                .then((res) => {
                    this.opcionesTipoCancer = res.data;
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al cargar los tipos de cáncer");
                    console.log(error);
                })
                .finally(() => {
                    this.loading.tipo_cancer = false;
                });
        },
        listarTipoMetabolicas() {
            this.loading.tipo_metabolicas = true;
            this.$axios
                .get("tipo-metabolicas-caracterizacion/listarTodas")
                .then((res) => {
                    this.opcionesMetabolicas = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de enfermedades metabólicas"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading.tipo_metabolicas = false;
                });
        },

        listarTipoRCV() {
            this.loading.tipo_rcv = true;
            this.$axios
                .get("tipo-rcv-caracterizacion/listarTodas")
                .then((res) => {
                    this.opcionesRCV = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de enfermedades RCV"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading.tipo_rcv = false;
                });
        },

        listarTipoRespiratorias() {
            this.loading.tipo_respiratorias = true;
            this.$axios
                .get("tipo-respiratorias-caracterizacion/listarTodas")
                .then((res) => {
                    this.opcionesRespiratoria = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de enfermedades respiratorias"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading.tipo_respiratorias = false;
                });
        },

        listarTipoInmunodeficiencias() {
            this.loading.tipo_inmunodeficiencia = true;
            this.$axios
                .get("tipo-inmunodeficiencias-caracterizacion/listarTodas")
                .then((res) => {
                    this.opcionesInmunodeficiencia = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de enfermedades de inmunodeficiencia"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading.tipo_inmunodeficiencia = false;
                });
        },

        listarOtrasCondicionesRiesgo() {
            this.loading.condiciones_riesgo = true;
            this.$axios
                .get("condiciones-riesgo-caracterizacion/listarTodas")
                .then((res) => {
                    this.opcionesOtrasCondicionesRiesgo = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar las otras condiciones de riesgo"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading.condiciones_riesgo = false;
                });
        },

        listarRutaPromocionCaracterizacion() {
            this.ruta_promocion = true;
            this.$axios
                .get("ruta-promocion-caracterizacion/listarTodas")
                .then((res) => {
                    this.opcionesRutaPromocion = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar las rutas de promocion"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.ruta_promocion = false;
                });
        },

        cerrarModal() {
            this.limpiarAfiliado();
            this.modalCaracterizacion = false;
        },

        enviarFormulario() {
            if (this.$refs.formularioCaracterizacion.validate()) {
                const formData = new FormData();
                formData.append("afiliado_id", this.afiliado.id);
                formData.append("reaccion_alergica", this.afiliado.caracterizacion_afiliado.reaccion_alergica);
                formData.append("vacunado_covid", this.afiliado.caracterizacion_afiliado.vacunado_covid);
                formData.append("ocupacion", this.afiliado.caracterizacion_afiliado.ocupacion);
                formData.append("nivel_escolar", this.afiliado.caracterizacion_afiliado.nivel_escolar);
                formData.append("orientacion_sexual", this.afiliado.caracterizacion_afiliado.orientacion_sexual);
                formData.append("tipo_vivienda", this.afiliado.caracterizacion_afiliado.tipo_vivienda);
                formData.append("cantidad_personas_vive", this.afiliado.caracterizacion_afiliado.cantidad_personas_vive);
                formData.append("estrato_socioeconomico", this.afiliado.caracterizacion_afiliado.estrato_socioeconomico);
                formData.append("agua_alcantarillado", this.afiliado.caracterizacion_afiliado.agua_alcantarillado);
                formData.append("metodo_cocina", this.afiliado.caracterizacion_afiliado.metodo_cocina);
                formData.append("energia_electrica", this.afiliado.caracterizacion_afiliado.energia_electrica);
                formData.append("accesibilidad_vivienda", this.afiliado.caracterizacion_afiliado.accesibilidad_vivienda);
                formData.append("seguridad_orden", this.afiliado.caracterizacion_afiliado.seguridad_orden);
                formData.append("etnia", this.afiliado.caracterizacion_afiliado.etnia);
                formData.append("tamizaje_prostata", this.afiliado.caracterizacion_afiliado.tamizaje_prostata);
                formData.append("metodo_planificacion", this.afiliado.caracterizacion_afiliado.metodo_planificacion);
                formData.append("planeado_embarazo", this.afiliado.caracterizacion_afiliado.planeado_embarazo);
                formData.append("citologia_ultimo_ano", this.afiliado.caracterizacion_afiliado.citologia_ultimo_ano);
                formData.append("tamizaje_mamografia", this.afiliado.caracterizacion_afiliado.tamizaje_mamografia);
                formData.append("tipo_violencia_id", this.afiliado.caracterizacion_afiliado.tipo_violencia_id);
                formData.append("discapacidad", this.afiliado.caracterizacion_afiliado.discapacidad);

                // Asegurar que los arrays sean solo de IDs
                formData.append("opcionesCuidadoSalud", JSON.stringify(this.extraerIds(this.afiliado.caracterizacion_afiliado
                    .practica)));
                formData.append("cancer_propio", JSON.stringify(this.extraerIds(this.afiliado.caracterizacion_afiliado
                    .tipo_cancer_propio)));
                formData.append("cancer_familia", JSON.stringify(this.extraerIds(this.afiliado.caracterizacion_afiliado
                    .tipo_cancer_familia)));
                formData.append("metabolica_propia", JSON.stringify(this.extraerIds(this.afiliado.caracterizacion_afiliado
                    .tipo_metabolica_propio)));
                formData.append("metabolica_familia", JSON.stringify(this.extraerIds(this.afiliado.caracterizacion_afiliado
                    .tipo_metabolica_familia)));
                formData.append("rcv_propia", JSON.stringify(this.extraerIds(this.afiliado.caracterizacion_afiliado
                    .tipo_r_c_v)));
                formData.append("respiratoria_propia", JSON.stringify(this.extraerIds(this.afiliado.caracterizacion_afiliado
                    .tipo_respiratoria)));
                formData.append("inmunodeficiencia_propia", JSON.stringify(this.extraerIds(this.afiliado
                    .caracterizacion_afiliado.tipo_inmunodeficiencia)));
                formData.append("condicionesRiesgo", JSON.stringify(this.extraerIds(this.afiliado.caracterizacion_afiliado
                    .condicion_riesgo)));
                formData.append("rutaAtencionIntegral", JSON.stringify(this.extraerIds(this.afiliado.caracterizacion_afiliado
                    .ruta_promocion)));

                this.preload = true;

                try {
                    this.$axios.post(`caracterizacion/auditoria/${this.afiliado.caracterizacion_afiliado.id}`);
                } catch (error) {
                    this.$toast.error("Ocurrió un error al guardar la caracterización");
                } finally {
                    this.preload = true;
                    this.$axios
                        .post("/afiliados/crearCaracterizacion", formData)
                        .then((res) => {
                            this.$toast.success("Caracterización guardada con éxito");
                        })
                        .catch((e) => {
                            this.$toast.error("Ocurrió un error al guardar la caracterización");
                            console.error(e);
                        })
                        .finally(() => {
                            this.preload = false;
                        });


                }
            } else {
                this.$toast.error("Por favor llene todos los campos obligatorios.");

            }
        },

        extraerIds(items) {
            if (!Array.isArray(items)) return [];
            return items.map(item => typeof item === 'object' && item !== null ? item.id : item);
        }

    },
};

</script>
