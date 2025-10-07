<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="6" sm="12">
                <v-card class="pa-4">
                    <v-alert text dense border="left" color="blue-grey" icon="mdi-filter">Filtros de búsqueda</v-alert>
                    <v-row dense>
                        <v-col cols="12" md="6">
                            <v-autocomplete dense outlined label="Tipo de documento" :items="tiposDocumentos"
                                :loading="loading" no-data-text="No hay resultados" item-value="id" item-text="nombre"
                                v-model="datosBuscarAfiliado.tipo_documento" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field dense outlined label="Número documento" @keyup.enter="consultarAfiliado()"
                                v-model.trim="datosBuscarAfiliado.numero_documento" />
                        </v-col>
                        <v-col cols="12" class="d-flex gap-2">
                            <v-btn small color="primary" dark @click="consultarAfiliado()">Consultar <v-icon
                                    right>mdi-magnify</v-icon></v-btn>
                            <v-btn small color="red" dark @click="limpiarAfiliado()">Limpiar<v-icon
                                    right>mdi-close</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <v-col cols="12" md="6" sm="12">
                <v-card class="pa-4">
                    <v-alert text dense border="left" color="blue-grey"
                        icon="mdi-arrow-down-bold-circle-outline">Exportar Datos</v-alert>
                    <v-row dense>
                        <v-col cols="6">
                            <v-text-field dense outlined v-model="formFiltroIndicador.desde" type="date"
                                label="Desde"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field dense outlined v-model="formFiltroIndicador.hasta" type="date"
                                label="Hasta"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="text-right">
                            <v-btn small @click="exportarIndicador" color="success">Exportar<v-icon
                                    right>mdi-arrow-collapse-down</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row dense v-if="afiliado">
            <v-card elevation="0">
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                                <span>Formulario Indicador Oncología FOMAG</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                    </v-toolbar>
                </v-card-title>
            </v-card>
            <v-card elevation="2">
                <v-col cols="12">
                    <v-data-table :headers="header" :items="[{}]" disable-pagination hide-default-footer>
                        <template v-slot:item="{ headers }">
                            <template v-for="item in headers">
                                <template v-if="item.value === 'cie10'">
                                    <td>
                                        <v-autocomplete :loading="loading" :items="cie10s" item-text="Codigo_Nombre"
                                            item-value="codigo_cie10" label="Diagnóstico"
                                            :search-input.sync="buscarCie10" v-model="datosIndicador[item.value]" />
                                    </td>
                                </template>
                                <template v-else>
                                    <td v-if="item.tipo === 'seleccion'">
                                        <v-select class="estiloCampo" dense outlined :items="item.elementos"
                                            v-model="datosIndicador[item.value]"></v-select>
                                    </td>
                                    <td v-else-if="item.tipo === 'visual'">
                                        <v-text-field class="estiloCampo" dense outlined
                                            v-model="datosIndicador[item.value]" readonly></v-text-field>
                                    </td>
                                    <td v-else-if="item.tipo === 'calendario'">
                                        <v-text-field class="estiloCampo" dense outlined type="date"
                                            v-model="datosIndicador[item.value]"></v-text-field>
                                    </td>
                                    <td v-else>
                                        <v-text-field class="estiloCampo" dense outlined
                                            v-model="datosIndicador[item.value]"></v-text-field>
                                    </td>
                                </template>
                            </template>
                        </template>
                    </v-data-table>
                </v-col>
                <v-col cols="12">
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="success" @click="guardarDatosIndicador()">Guardar<v-icon
                                right>mdi-alert-circle-check-outline</v-icon></v-btn>
                    </v-card-actions>
                </v-col>
            </v-card>
        </v-row>

        <v-divider class="my-5 full-width-divider"></v-divider>

        <HistoricoIndicadoresOncologicosFomag :afiliado="afiliado"></HistoricoIndicadoresOncologicosFomag>
    </v-container>
</template>
<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "~/components/afiliado/FormularioAfiliadoComponente.vue";
import HistoricoIndicadoresOncologicosFomag from "~/components/indicadores/historicoIndicadoresOncologicosFomag.vue";
import Cirugia from "~/components/agendamientoCirugia/cirugia.vue";
import cups from "~/pages/contrato/cups.vue";
export default {
    name: "IndicadoresOncologicosFomag",
    computed: {
        cups() {
            return cups
        }
    },
    components: { EditarAfiliadoComponente, HistoricoIndicadoresOncologicosFomag },
    data() {
        return {
            formFiltroIndicador: {
                desde: null,
                hasta: null
            },
            anios: [
                this.$moment().format('YYYY'),
                this.$moment().format('YYYY') - 1,
                this.$moment().format('YYYY') - 2,
            ],
            meses: [
                { id: '01', nombre: 'Enero' },
                { id: '02', nombre: 'Febrero' },
                { id: '03', nombre: 'Marzo' },
                { id: '04', nombre: 'Abril' },
                { id: '05', nombre: 'Mayo' },
                { id: '06', nombre: 'Junio' },
                { id: '07', nombre: 'Julio' },
                { id: '08', nombre: 'Agosto' },
                { id: '09', nombre: 'Septiembre' },
                { id: '10', nombre: 'Octubre' },
                { id: '11', nombre: 'Noviembre' },
                { id: '12', nombre: 'Diciembre' }
            ],
            historicoDatos: [],
            municipios: [],
            cie10s: [],
            buscarCie10: null,
            agrupador: [],
            afiliado: null,
            tiposDocumentos: [],
            loading: false,
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
            header: [
                {
                    text: 'CLASIFICACION CA PRIORIZADO', align: 'left', value: 'clasificacion_ca_priorizado', tipo: 'seleccion', elementos: [
                        'Ca de Mama',
                        'Ca de Prostata',
                        'Ca de Cérvix y Cuello Uterino',
                        'Ca Gastrico',
                        'Ca Colorectal',
                        'Ca de Pulmon',
                        'Ca de Tiroides',
                        'Melanoma',
                        'Linfomas LNH y LH',
                        'Ca de Piel',
                        'Ca Renal',
                        'Ca Oseo',
                        'Ca de Testiculos',
                        'Ca de Paratiroides',
                        'Ca Peritoneal',
                        'Ca Retroperitoneal',
                        'Ca de Ovario',
                        'Ca Vagina',
                        'Ca de Ano',
                        'Ca de Lengua',
                        'Ca de Esofago',
                        'Ca de Pancreas',
                        'Ca de Laringe',
                        'Ca de Pleura',
                        'Ca de Bronquios',
                        'Ca de Corazón',
                        'Ca de Paladar',
                        'Ca de Pene',
                        'Ca de Vejiga',
                        'Ca de Trompa de Falopio'
                    ]
                },
                { text: 'DEPARTAMENTO', align: 'left', value: 'departamento', tipo: 'visual' },
                { text: 'MUNICIPIO', align: 'left', value: 'municipio', tipo: 'visual' },
                { text: 'IPS', align: 'left', value: 'ips', tipo: 'visual' },
                { text: 'ENTIDAD', align: 'left', value: 'entidad', tipo: 'visual' },
                { text: 'TIPO DE DOCUMENTO', align: 'left', value: 'tipo_documento', tipo: 'visual' },
                { text: 'DOCUMENTO', align: 'left', value: 'documento', tipo: 'visual' },
                { text: 'NOMBRE USUARIO', align: 'left', value: 'nombre_usuario', tipo: 'visual' },
                { text: 'SEXO', align: 'left', value: 'sexo', tipo: 'visual' },
                { text: 'EDAD AL MOMENTO DEL DIAGNOSTICO', align: 'left', value: 'edad_momento_diagnostico', tipo: 'visual' },
                { text: 'CICLO DE VIDA', align: 'left', value: 'ciclo_vida', tipo: 'visual' },
                { text: '1ERA CONSULTA MEDICO QUE ORDENA (MAMOGRAFIA, ECOGRAFIA DE MAMA, PSA, ENDOSCOPIA, COLONOSCOPIA, CITOLOGIA, COLPOSCOPIA, PSA, ECOGRAFIA DE PROSTATA, TSH, ECOGRAFIA DE TIROIDES, RX DE TÓRAX, TAC DE TÓRAX', align: 'left', value: 'primera_consulta_medico_ordena', tipo: 'calendario' },
                { text: 'FECHA CONCULTA INICIAL MEDICO QUE ORDENA LA BIOPSIA', align: 'left', value: 'fecha_consulta_inicial_medico_ordena_biopsia', tipo: 'calendario' },
                { text: 'FECHA AUTORIZACIÓN DE LA BIOPSIA', align: 'left', value: 'fecha_Autorizacion_biopsia', tipo: 'calendario' },
                { text: 'FECHA DE LA TOMA DE MUESTRA DE  LA BIOPSIA', align: 'left', value: 'fecha_toma_muestra_biopsia', tipo: 'calendario' },
                { text: 'FECHA INGRESO DE LA BIOPSIA', align: 'left', value: 'fecha_ingreso_biopsia', tipo: 'calendario' },
                { text: 'FECHA SALIDA DE LA BIOPSIA ( REPORTE)', align: 'left', value: 'fecha_salida_biopsia_reporte', tipo: 'calendario' },
                { text: 'FECHA DE DIAGNÓSTICO PATOLOGIA INICIAL', align: 'left', value: 'fecha_diagnostico_patologia_inicial', tipo: 'calendario' },
                { text: 'FECHA DE DIAGNÓSTICO POR IHQ', align: 'left', value: 'fecha_diagnosticos_ihq', tipo: 'calendario' },
                { text: 'FECHA DE DIAGNÓSTICO POS OPERATORIO', align: 'left', value: 'fecha_diagnostico_pos_operatorio', tipo: 'calendario' },
                { text: 'FECHA DE DIAGNÓSTICO POR IHQ POS OPERATORIA', align: 'left', value: 'fecha_diagnostico_por_iht_pos_operatorio', tipo: 'calendario' },
                { text: 'FECCHA DEL REPORTE DEL LABORATORIO', align: 'left', value: 'fecha_reporte_laboratorio', tipo: 'calendario' },
                { text: 'FECHA SOLICITUD 1ERA COSNULTA INGRESO PROGRAMA ONCOLOGIA (SUPERVIVIENTE) MAMA, PROSTATA, GASTRICO, COLO-RECTAL', align: 'left', value: 'fecha_solicitud_primera_consulta_ingreso_programa_oncologia', tipo: 'calendario' },
                { text: 'FECHA  1ERA COSNULTA INGRESO PROGRAMA ONCOLOGIA (SUPERVIVIENTE) MAMA, PROSTATA, GASTRICO, COLO-RECTAL', align: 'left', value: 'fecha_primera_consulta_ingreso_programa_oncologia', tipo: 'calendario' },
                { text: 'OPORTUNIDAD INGRESO PROGRAMA ONCOLOGIA POR MEDICO SUPERVIVIENTE', align: 'left', value: 'oportunidad_ingreso_programa_oncologia_medico_superviviente', tipo: 'visual' },
                { text: 'FECHA SOLICITUD 1ERA CONSULTA ESPECIALISTA TRATANTE', align: 'left', value: 'fecha_solicitud_primera_consulta_Especialista_tratante', tipo: 'calendario' },
                { text: 'FECHA 1ERA CONSULTA CONSULTA ESPECIALISTA TRATANTE', align: 'left', value: 'fecha_primera_consulta_especialista_tratante', tipo: 'calendario' },
                { text: 'OPORTUNIDAD DESDE EL DX HASTA LA EVALUACION POR EL ESPECIALISATA', align: 'left', value: 'oportunidad_desde_dx_hasta_Evaluacion_especialista', tipo: 'visual' },
                {
                    text: 'ESPECIALIDAD', align: 'left', value: 'especialidad', tipo: 'seleccion', elementos: [
                        'Hemato-Oncologia',
                        'Oncologia',
                        'Cirugia Oncologia',
                        'Cirugia Plastica',
                        'Mastologia',
                        'Ortopédia Oncologica',
                        'Cirugia de Tórax',
                        'Cirugia de Cabeza y Cuello',
                        'Urologia',
                        'Gineco-Oncologia',
                        'Hematologia',
                        'Dolor y Cuidados Paliativos'
                    ]
                },
                {
                    text: 'PRESTADOR', align: 'left', value: 'prestador', tipo: 'seleccion', elementos: [
                        'CLINICA VICTORIANA',
                        'SUMIMEDICAL SEDE VILLANUEVA'
                    ]
                },
                {
                    text: 'MES', align: 'left', value: 'mes', tipo: 'seleccion', elementos: [
                        'ENERO',
                        'FEBRERO',
                        'MARZO',
                        'ABRIL',
                        'MAYO',
                        'JUNIO',
                        'JULIO',
                        'AGOSTO',
                        'SEPTIEMBRE',
                        'OCTUBRE',
                        'NOVIEMBRE',
                        'DICIEMBRE'
                    ]
                },
                {
                    text: 'AÑO', align: 'left', value: 'anio', tipo: 'seleccion', elementos: [
                        this.$moment().format('YYYY'),
                        this.$moment().format('YYYY') - 1
                    ]
                },
                { text: 'CIE 10', align: 'left', value: 'cie10', tipo: 'seleccion', elementos: [] },
                { text: 'DESCRIPCION CIE 10', align: 'left', value: 'descripcion_cie10', tipo: 'visual' },
                {
                    text: 'AGRUPADO DIDIER', align: 'left', value: 'agrupado_didier', tipo: 'seleccion', elementos: [
                        'Ca de Mama',
                        'Ca de Próstata',
                        'Ca de Cérvix y Cuello Uterino',
                        'Ca Gastrico',
                        'Ca Colorectal',
                        'Ca de Pulmon',
                        'Ca de Tiroides',
                        'Melanoma',
                        'Linfomas LNH y LH',
                        'Ca de Piel',
                        'Ca Renal',
                        'Ca Oseo',
                        'Ca de Testiculos',
                        'Ca de Paratiroides',
                        'Ca Peritoneal',
                        'Ca Retroperitoneal',
                        'Ca de Ovario',
                        'Ca Vagina',
                        'Ca de Ano',
                        'Ca de Lengua',
                        'Ca de Esofago',
                        'Ca de Pancreas',
                        'Ca de Laringe',
                        'Ca de Pleura',
                        'Ca de Bronquios',
                        'Ca de Corazón',
                        'Ca de Paladar',
                        'Ca de Pene',
                        'Ca de Vejiga',
                        'Ca de Trompa de Falopio'
                    ]
                },
                {
                    text: 'TIPO DE INICIO DE TTO-MONO-POLI-CX', align: 'left', value: 'tipo_inicio_tto_mono_poli_cx', tipo: 'seleccion', elementos: [
                        'Cirugia',
                        'Poliquimio',
                        'Monoquimio',
                        'Radioterapia',
                        'Braquiterapia',
                    ]
                },
                { text: 'TNM', align: 'left', value: 'tnm', tipo: 'texto' },
                {
                    text: 'ESCALA GLEASON', align: 'left', value: 'escala_gleason', tipo: 'seleccion', elementos: [
                        '3 + 3',
                        '3 + 4',
                        '4 + 3',
                        '4 + 4',
                        '4 + 5'
                    ]
                },
                { text: 'ESTADIO', align: 'left', value: 'estadio', tipo: 'seleccion', elementos: ['0', 'I', 'IA', 'IA1', 'IA2', 'IB', 'IB1', 'IB2', 'IB3', 'II', 'IIA', 'IIA1', 'IIA2', 'IIB', 'IIC', 'III', 'IIIA', 'IIIB', 'IIIC', 'IV', 'IVA', 'IVB', 'V'] },
                {
                    text: 'Tipo de Cirugia Conservadora o no  ca de mama', align: 'left', value: 'tipo_cirugia_conservadora_ca_mama', tipo: 'seleccion', elementos: [
                        'Conservadora Cuadrantectomia',
                        'Mastectomia Radical Unilateral',
                        'Mastectomia Radical Bilateral'
                    ]
                },
                { text: 'RIESGO SOLO APLICA EN PROSTATA', align: 'left', value: 'riesgo_aplica_prostata', tipo: 'visual' },
                { text: 'Control PSA', align: 'left', value: 'control_psa', tipo: 'calendario' },
                {
                    text: 'CLASIFICACION ANN ARBOR O LUGANO I-II-III-IV', align: 'left', value: 'clasificacion_ann_arbor_lugano', tipo: 'seleccion', elementos: [
                        'I',
                        'II',
                        'III',
                        'IV'
                    ]
                },
                { text: 'RH ESTROGENOS (Positivos y Negativos )', align: 'left', value: 'rh_estrogenos', tipo: 'texto' },
                { text: 'RH PROGESTAGENOS  (Positivos y Negativos )', align: 'left', value: 'rh_progestagenos', tipo: 'texto' },
                { text: 'KI-67 (%)', align: 'left', value: 'ki_67', tipo: 'texto' },
                {
                    text: 'HER-2 (Positivo -Negativo )', align: 'left', value: 'her_2', tipo: 'seleccion', elementos: [
                        'HER2 0',
                        'HER2 1+',
                        'HER2 2+',
                        'HER2 3+'
                    ]
                },
                { text: 'TTO HORMONAL', align: 'left', value: 'tto_hormonal', tipo: 'texto' },
                { text: 'TTO ANTI HER2', align: 'left', value: 'tto_anti_her2', tipo: 'texto' },
                { text: 'REMSION A CONSULTA DE RADIOTERAPIA', align: 'left', value: 'remision_consulta_radioterapia', tipo: 'calendario' },
                { text: 'FECHA INICIO RADIOTERAPIA', align: 'left', value: 'fecha_inicio_radioterapia', tipo: 'calendario' },
                { text: 'FECHA INICIO BRAQUITERAPIA', align: 'left', value: 'fecha_inicio_braquiterapia', tipo: 'calendario' },
                {
                    text: 'IPS DE DIRECCIONAMIENTO RADIOTERAPIA', align: 'left', value: 'ips_direccionamiento_radioterapia', tipo: 'seleccion', elementos: [
                        'HOSPITAL PABLO TOBON URIBE',
                        'CENTRO ONCOLOGICO DE ANTIOQUIA',
                        'INSTITUTO DE CANCEROLOGIA',
                        'CLINICA DEL ROSARIO SEDE TESORO',
                        'HOSPITAL SAN VICENTE DE PAUL SEDE MEDELLIN',
                        'HOSPITAL SAN VICENTE DE PAUL SEDE RIONEGRO',
                        'CLINICA SOMER RIONEGRO',
                        'CLINAC',
                        'ASTROGA'
                    ]
                },
                { text: 'FECHA REMISON A MEDICINA DEL DOLOR', align: 'left', value: 'fecha_remision_medicina_dolor', tipo: 'calendario' },
                { text: 'FECHA PROGRAMACION CITA DOLOR', align: 'left', value: 'fecha_programa_cita_dolor', tipo: 'calendario' },
                {
                    text: 'ESTADO DE LA CONSULTA', align: 'left', value: 'estado_consulta', tipo: 'seleccion', elementos: [
                        'Programada',
                        'Atendida',
                        'Cancelada',
                        'inasistida'
                    ]
                },
                {
                    text: 'REMITE A CX DE TORAX', align: 'left', value: 'remite_cx_torax', tipo: 'seleccion', elementos: [
                        'SI',
                        'NO'
                    ]
                },
                { text: 'FECHA PRIMERA CONSULTA CIRUGIA DE TORAX', align: 'left', value: 'fecha_primera_Consulta_cirugia_torax', tipo: 'calendario' },
                {
                    text: 'REMISION A ONCOLOGIA O HEMATO-ONCOLOGIA', align: 'left', value: 'remision_oncologia_hemato_oncologia', tipo: 'seleccion', elementos: [
                        'SI',
                        'NO'
                    ]
                },
                { text: 'FECHA 1ERA CONSULTA ONCOLOGIA O HEMATO-ONCOLOGIA', align: 'left', value: 'fecha_primera_consulta_oncologia_hemato_oncologia', tipo: 'calendario' },
                {
                    text: 'REMISION A MASTOLOGIA', align: 'left', value: 'remision_mastologia', tipo: 'seleccion', elementos: [
                        'SI',
                        'NO'
                    ]
                },
                { text: 'FECHA 1ERA CONSULTA MASTOLOGIA', align: 'left', value: 'fecha_primera_consulta_mastologia', tipo: 'calendario' },
                {
                    text: 'REMITE A CX PLASTICA', align: 'left', value: 'remite_cx_palstica', tipo: 'seleccion', elementos: [
                        'SI',
                        'NO'
                    ]
                },
                { text: 'FECHA 1ERA CONSULTA CIRUGIA PLASTICA', align: 'left', value: 'fecha_primera_consulta_cirugia_plastica', tipo: 'calendario' },
                { text: 'FECHA  EN QUE SE ORDENA EL 1ER  TTO (Quimio, Cirugia, Radioterapia )', align: 'left', value: 'fecha_ordena_primer_tto', tipo: 'calendario' },
                { text: 'FECHA EN QUE SE INICIA 1ER TTO (Quimio, Cirugia, Radioterapia )', align: 'left', value: 'fecha_inicia_primer_tto', tipo: 'calendario' },
                { text: 'OPORTUNIDAD INICIO 1ER TTO', align: 'left', value: 'oportunidad_inicio_tto', tipo: 'visual' },
                { text: 'FECHA EN QUE SE ORDENA EL 1ER TRATAMIENTO POS (Quimio, Cirugia, Radioterapia )', align: 'left', value: 'fecha_ordena_primer_tratamiento_pos', tipo: 'calendario' },
                { text: 'FECHA INICIO TTO POS (Quimio, Cirugia, Radioterapia )  (ADYUVANCIA)', align: 'left', value: 'fecha_inicio_tto_pos', tipo: 'calendario' },
                { text: 'OPORTUNIDAD TTO POS CX (ADYUVANCIA)', align: 'left', value: 'oportunidad_tto_pos_cx', tipo: 'visual' },
                { text: 'FECHA EN QUE SE ORDENA EL 1ER TRATAMIENTO NEOADYUVANTE (Antes de la cirugia )', align: 'left', value: 'fecha_ordena_primer_tratamiento_neoadyuvante', tipo: 'calendario' },
                { text: 'FECHA INICIO TTO NEOADYUVANTE', align: 'left', value: 'fecha_inicio_tto_neoadyuvante', tipo: 'calendario' },
                { text: 'FECHA FIN TTO NEOADYUVANTE', align: 'left', value: 'fecha_fin_tto_neoadyuvancia', tipo: 'calendario' },
                { text: 'FECHA REALIZACION CIRUGIA', align: 'left', value: 'fecha_realizacion_cirugia', tipo: 'calendario' },
                { text: 'OPORTUNIDAD NEOADYUVNCIA', align: 'left', value: 'oportunidad_neoadyuvante', tipo: 'visual' },
                {
                    text: 'ESTADO DE AFILIACION (VIVO-FALLECIDO)', align: 'left', value: 'estado_afiliado', tipo: 'seleccion', elementos: [
                        'Activo',
                        'Retirado',
                        'Fallecido',
                        'Inactivo'
                    ]
                },
                {
                    text: 'DISENTIMIENTO', align: 'left', value: 'disentimiento', tipo: 'seleccion', elementos: [
                        'SI',
                        'NO'
                    ]
                },
                { text: 'CLASIFICACION RIESGO INTERNACIONAL LH LNH', align: 'left', value: 'clasificacion_riesgo_internacional_lh_lnh', tipo: 'texto' },
                { text: 'OBSERVACIONES GENERALES', align: 'left', value: 'observaciones_generales', tipo: 'texto' },
            ],
            datosIndicador: {
                clasificacion_ca_priorizado: null,
                departamento: null,
                municipio: null,
                ips: null,
                entidad: null,
                tipo_documento: null,
                documento: null,
                nombre_usuario: null,
                sexo: null,
                edad_momento_diagnostico: null,
                ciclo_vida: null,
                primera_consulta_medico_ordena: null,
                fecha_consulta_inicial_medico_ordena_biopsia: null,
                fecha_Autorizacion_biopsia: null,
                fecha_toma_muestra_biopsia: null,
                fecha_ingreso_biopsia: null,
                fecha_salida_biopsia_reporte: null,
                fecha_diagnostico_patologia_inicial: null,
                fecha_diagnosticos_ihq: null,
                fecha_diagnostico_pos_operatorio: null,
                fecha_diagnostico_por_iht_pos_operatorio: null,
                fecha_reporte_laboratorio: null,
                fecha_solicitud_primera_consulta_ingreso_programa_oncologia: null,
                fecha_primera_consulta_ingreso_programa_oncologia: null,
                oportunidad_ingreso_programa_oncologia_medico_superviviente: null,
                fecha_solicitud_primera_consulta_Especialista_tratante: null,
                fecha_primera_consulta_especialista_tratante: null,
                oportunidad_desde_dx_hasta_Evaluacion_especialista: null,
                especialidad: null,
                prestador: null,
                mes: null,
                anio: null,
                cie10: null,
                descripcion_cie10: null,
                agrupado_didier: null,
                tipo_inicio_tto_mono_poli_cx: null,
                tnm: null,
                escala_gleason: null,
                estadio: null,
                tipo_cirugia_conservadora_ca_mama: null,
                riesgo_aplica_prostata: null,
                control_psa: null,
                clasificacion_ann_arbor_lugano: null,
                rh_estrogenos: null,
                rh_progestagenos: null,
                ki_67: null,
                her_2: null,
                tto_hormonal: null,
                tto_anti_her2: null,
                remision_consulta_radioterapia: null,
                fecha_inicio_radioterapia: null,
                fecha_inicio_braquiterapia: null,
                ips_direccionamiento_radioterapia: null,
                fecha_remision_medicina_dolor: null,
                fecha_programa_cita_dolor: null,
                estado_consulta: null,
                remite_cx_torax: null,
                fecha_primera_Consulta_cirugia_torax: null,
                remision_oncologia_hemato_oncologia: null,
                fecha_primera_consulta_oncologia_hemato_oncologia: null,
                remision_mastologia: null,
                fecha_primera_consulta_mastologia: null,
                remite_cx_palstica: null,
                fecha_primera_consulta_cirugia_plastica: null,
                fecha_ordena_primer_tto: null,
                fecha_inicia_primer_tto: null,
                oportunidad_inicio_tto: null,
                fecha_ordena_primer_tratamiento_pos: null,
                fecha_inicio_tto_pos: null,
                oportunidad_tto_pos_cx: null,
                fecha_ordena_primer_tratamiento_neoadyuvante: null,
                fecha_inicio_tto_neoadyuvante: null,
                fecha_fin_tto_neoadyuvancia: null,
                fecha_realizacion_cirugia: null,
                oportunidad_neoadyuvante: null,
                estado_afiliado: null,
                observaciones_generales: null,
                disentimiento: null,
                clasificacion_riesgo_internacional_lh_lnh: null
            },
        }
    },
    watch: {
        afiliado() {
            if (this.afiliado) {
                const municipio = this.municipios.find(s => parseInt(s.id) === parseInt(this.afiliado.mpio_residencia_id))
                this.datosIndicador.municipio = municipio.nombre;
                this.datosIndicador.departamento = municipio.departamento.nombre;
                this.datosIndicador.ips = this.afiliado.ips.nombre;
                this.datosIndicador.entidad = this.afiliado.entidad.nombre;
                this.datosIndicador.tipo_documento = this.afiliado.tipo_documento.sigla;
                this.datosIndicador.documento = this.afiliado.numero_documento;
                this.datosIndicador.nombre_usuario = [
                    this.afiliado?.primer_nombre,
                    this.afiliado?.segundo_nombre,
                    this.afiliado?.primer_apellido,
                    this.afiliado?.segundo_apellido,
                ].filter(Boolean).join(' ') || 'Sin nombre';
                this.datosIndicador.sexo = this.afiliado.sexo;
                this.datosIndicador.ciclo_vida = this.afiliado.ciclo_vida_atencion
            }
        },
        'datosIndicador.fecha_diagnostico_patologia_inicial'() {
            if (this.datosIndicador.fecha_diagnostico_patologia_inicial) {
                this.datosIndicador.edad_momento_diagnostico = this.$moment(this.datosIndicador.fecha_diagnostico_patologia_inicial).diff(this.afiliado.fecha_nacimiento, 'years')
            }
            if (this.datosIndicador.fecha_primera_consulta_especialista_tratante) {
                this.datosIndicador.oportunidad_desde_dx_hasta_Evaluacion_especialista = this.$moment(this.datosIndicador.fecha_primera_consulta_especialista_tratante).diff(this.datosIndicador.fecha_diagnostico_patologia_inicial, 'days')
            }
            if (this.datosIndicador.fecha_inicia_primer_tto) {
                this.datosIndicador.oportunidad_inicio_tto = this.$moment(this.datosIndicador.fecha_inicia_primer_tto).diff(this.datosIndicador.fecha_diagnostico_patologia_inicial, 'days')
            }
        },
        'datosIndicador.fecha_primera_consulta_ingreso_programa_oncologia'() {
            if (this.datosIndicador.fecha_solicitud_primera_consulta_ingreso_programa_oncologia) {
                this.datosIndicador.oportunidad_ingreso_programa_oncologia_medico_superviviente = this.$moment(this.datosIndicador.fecha_primera_consulta_ingreso_programa_oncologia).diff(this.datosIndicador.fecha_solicitud_primera_consulta_ingreso_programa_oncologia, 'days')
            }
        },
        'datosIndicador.fecha_solicitud_primera_consulta_ingreso_programa_oncologia'() {
            if (this.datosIndicador.fecha_primera_consulta_ingreso_programa_oncologia) {
                this.datosIndicador.oportunidad_ingreso_programa_oncologia_medico_superviviente = this.$moment(this.datosIndicador.fecha_primera_consulta_ingreso_programa_oncologia).diff(this.datosIndicador.fecha_solicitud_primera_consulta_ingreso_programa_oncologia, 'days')
            }
        },
        'datosIndicador.fecha_primera_consulta_especialista_tratante'() {
            if (this.datosIndicador.fecha_diagnostico_patologia_inicial) {
                this.datosIndicador.oportunidad_desde_dx_hasta_Evaluacion_especialista = this.$moment(this.datosIndicador.fecha_primera_consulta_especialista_tratante).diff(this.datosIndicador.fecha_diagnostico_patologia_inicial, 'days')
            }
        },
        'datosIndicador.cie10'() {
            const cie10 = this.cie10s.find(s => s.codigo_cie10 === this.datosIndicador.cie10);
            this.datosIndicador.descripcion_cie10 = cie10.nombre;
        },
        'datosIndicador.fecha_inicia_primer_tto'() {
            if (this.datosIndicador.fecha_diagnostico_patologia_inicial) {
                this.datosIndicador.oportunidad_inicio_tto = this.$moment(this.datosIndicador.fecha_inicia_primer_tto).diff(this.datosIndicador.fecha_diagnostico_patologia_inicial, 'days')
            }
            if (this.datosIndicador.fecha_inicio_tto_pos) {
                this.datosIndicador.oportunidad_tto_pos_cx = this.$moment(this.datosIndicador.fecha_inicio_tto_pos).diff(this.datosIndicador.fecha_inicia_primer_tto, 'days')
            }
        },
        'datosIndicador.fecha_inicio_tto_pos'() {
            if (this.datosIndicador.fecha_inicia_primer_tto) {
                this.datosIndicador.oportunidad_tto_pos_cx = this.$moment(this.datosIndicador.fecha_inicio_tto_pos).diff(this.datosIndicador.fecha_inicia_primer_tto, 'days')
            }
        },
        'datosIndicador.fecha_fin_tto_neoadyuvancia'() {
            if (this.datosIndicador.fecha_realizacion_cirugia) {
                this.datosIndicador.oportunidad_neoadyuvante = this.$moment(this.datosIndicador.fecha_realizacion_cirugia).diff(this.datosIndicador.fecha_fin_tto_neoadyuvancia, 'days')
            }
        },
        'datosIndicador.fecha_realizacion_cirugia'() {
            if (this.datosIndicador.fecha_fin_tto_neoadyuvancia) {
                this.datosIndicador.oportunidad_neoadyuvante = this.$moment(this.datosIndicador.fecha_realizacion_cirugia).diff(this.datosIndicador.fecha_fin_tto_neoadyuvancia, 'days')
            }
        },
        // 'datosIndicador.escala_gleason'(){
        // console.log(this.datosIndicador.escala_gleason);
        // let elementosIniciales = [];
        // const indice = this.header.findIndex(d => d.value === 'estadio');
        // switch (this.datosIndicador.escala_gleason){
        // 	case '3 + 3':
        // 		elementosIniciales.push('bien diferenciados o de bajo grado')
        // 		this.datosIndicador.riesgo_aplica_prostata = 'I';
        // 		break;
        // 	case '3 + 4':
        // 		this.datosIndicador.riesgo_aplica_prostata = 'II';
        // 		break;
        // 	case '4 + 3':
        // 		this.datosIndicador.riesgo_aplica_prostata = 'III';
        //
        // 		break;
        // 	case '4 + 4':
        // 		this.datosIndicador.riesgo_aplica_prostata = 'IV';
        // 		elementosIniciales.push('pobremente diferenciados o de alto grado')
        // 		break;
        // 	case '4 + 5':
        // 		this.datosIndicador.riesgo_aplica_prostata = 'V';
        // 		elementosIniciales.push('pobremente diferenciados o de alto grado')
        // 		break;
        // }
        // let elementosBases = ['0','I','IA','IA1','IA2','IB','IB1','IB2','IB3','II','IIA','IIA1','IIA2','IIB','IIC','III','IIIA','IIIB','IIIC','IV','IVA','IVB','V']
        // this.header[38].elementos = elementosIniciales.concat(elementosBases);
        // },
        buscarCie10(val) {
            if (val) {
                if (val.length === 6) {
                    this.listarCie10();
                } else if (val.length < 6) {
                    this.cie10s = [];
                }
            } else {
                this.cie10s = [];

            }
        },
    },
    mounted() {
        this.listarTiposDocumentos();
        this.listarMunicipios();
        this.listarDatos();
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
            for (const dato in this.datos) {
                this.datosIndicador[dato] = null;
            }
            this.afiliado = null;
        },
        guardarDatosIndicador() {
            this.setPreload(true);
            this.$axios.post('indicadores/guardar', this.datosIndicador).then(res => {
                this.$toast.success(res.data.mensaje);
                this.limpiarAfiliado();
                this.listarDatos();
            }).catch(e => console.log(e.response)).finally(() => { this.setPreload(false) })
        },
        listarCie10() {
            this.loading = true;
            this.setPreload(true);
            const data = {
                valor: this.buscarCie10
            }
            this.$axios.post('cie10/listarFiltro', data).then(res => {
                this.cie10s = res.data
            }).catch(err => {
                console.log(err)
                this.$toast.error(err.response.data.mensaje)
            }).finally(() => {
                this.setPreload(false);
                this.loading = false;
            })
        },
        listarMunicipios() {
            this.setPreload(true);
            this.$axios.get('municipios/listar').then(res => {
                this.municipios = res.data;
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.setPreload(false);
            })
        },
        listarDatos() {
            this.setPreload(true);
            this.$axios.get('indicadores/listar').then(res => {
                this.historicoDatos = res.data;
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.setPreload(false);
            })
        },
        exportarIndicador() {
            if (!this.formFiltroIndicador.desde) {
                return this.$toast.error('El campo "Desde" es requerido');
            }
            if (!this.formFiltroIndicador.hasta) {
                return this.$toast.error('El campo "Hasta" es requerido');
            }
            this.setPreload(true);
            this.$axios.post('indicadores/exportat-indicador/1', this.formFiltroIndicador, { responseType: 'blob', }).then(res => {
                let blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');

                a.download = 'reporte.xlsx';
                a.href = url;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                this.clear();
            }).catch(e => console.log(e.response)).finally(() => this.setPreload(false))
        }
    }
}
</script>
<style scoped>
td {
    min-width: 300px;
}
</style>
