<template>
    <div>
        <v-dialog v-if="datoSeleccionado !== null" v-model="dialogObservaciones" width="500">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    Observaciones Generales
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-textarea v-model="nuevaObservacion" auto-grow outlined
                                    label="Nueva Observación"></v-textarea>
                            </v-col>
                            <v-col cols="12" md="12"
                                v-if="isJsonString(historicoDatos[datoSeleccionado]['observaciones_generales'])">
                                <template
                                    v-for="item in JSON.parse(historicoDatos[datoSeleccionado]['observaciones_generales'])">
                                    <p>
                                        <strong>{{ item.fecha }}</strong>
                                        <br>
                                        {{ item.observacion }}
                                        <br>
                                        <strong>Responsable: </strong>{{ item.responsable }}
                                    </p>
                                    <v-divider></v-divider>
                                    <br>
                                </template>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark @click="dialogObservaciones = false">Cerrar</v-btn>
                    <v-btn color="success" dark @click="agregarObservacion()">Agregar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-container fluid>
            <v-row dense>
                <v-col cols="12">
                    <v-card elevation="0">
                        <v-card-title>
                            <v-toolbar flat>
                                <v-toolbar-title>
                                    <div class="d-flex align-center">
                                        <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                                        <span class="ml-2 font-weight-bold text-h6">Datos Guardados</span>
                                    </div>
                                </v-toolbar-title>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer></v-spacer>
                                <v-row dense>
                                    <v-select v-model="formFiltro.clasificacion_ca_priorizado" outlined dense
                                        :items="caPriorizados" label="Clasificación CA Priorizado" clearable
                                        class="mr-2" style="max-width: 300px;"></v-select>
                                    <v-text-field v-model="formFiltro.documento" outlined dense label="Número Documento"
                                        clearable class="mr-2" style="max-width: 300px;"></v-text-field>
                                    <v-btn color="success" @click="listarDatos()" small>Filtrar</v-btn>
                                </v-row>
                            </v-toolbar>
                        </v-card-title>
                    </v-card>
                </v-col>
                <v-col cols="12">
                    <v-card>
                        <v-alert text dense border="bottom" color="blue-grey" icon="mdi-history">Histórico de
                            Registros
                        </v-alert>
                        <div class="d-flex justify-space-between align-center">
                            <v-text-field v-model="buscar" label="Buscar" dense outlined clearable class="ml-4"
                                style="max-width: 300px;"
                                hint="Búsqueda de datos sobre los registros filtrados"></v-text-field>
                        </div>
                        <v-divider></v-divider>
                        <v-data-table dense fixed-header height="400px" :headers="header" :items="historicoDatos"
                            :search="buscar">
                            <template v-slot:body="{ items, headers }">
                                <tbody>
                                    <tr v-for="(item, idx) in items" :key="idx">
                                        <td v-for="(header, key) in headers" :key="key">
                                            <template v-if="header.value === 'observaciones_generales'">
                                                <v-btn icon color="info"
                                                    @click="datoSeleccionado = idx; dialogObservaciones = true">
                                                    <v-icon>mdi-eye</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-else-if="header.value === 'eliminar'">
                                                <v-btn color="red" x-small dark @click="eliminarRegistro(item)">Eliminar
                                                    <v-icon right dark>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-else>
                                                <v-edit-dialog :return-value.sync="item[header.value]"
                                                    @save="save(item.id, header.value, item[header.value])"
                                                    @cancel="cancel" @open="open" @close="close" large
                                                    cancel-text="Cancelar" save-text="Actualizar">
                                                    {{ item[header.value] ?? 'N/A' }}
                                                    <template v-slot:input>
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-autocomplete v-if="header.value === 'cie10'"
                                                                    :loading="loading" :items="cie10s"
                                                                    item-text="Codigo_Nombre" item-value="codigo_cie10"
                                                                    label="Diagnóstico" :search-input.sync="buscarCie10"
                                                                    v-model="item[header.value]" v-on="on" clearable />
                                                                <v-select v-else-if="header.tipo === 'seleccion'"
                                                                    v-on="on" :items="header.elementos"
                                                                    v-model="item[header.value]" clearable />
                                                                <v-text-field
                                                                    v-else-if="header.tipo === 'texto' || header.tipo === 'visual'"
                                                                    v-on="on" v-model="item[header.value]"
                                                                    :readonly="header.tipo === 'visual'" clearable />
                                                                <v-text-field v-else-if="header.tipo === 'calendario'"
                                                                    type="date" v-model="item[header.value]"
                                                                    clearable />
                                                            </template>
                                                            <span>{{ item[header.value] }}</span>
                                                        </v-tooltip>
                                                    </template>
                                                </v-edit-dialog>
                                            </template>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "HistoricoIndicadoresOncologicosFomag",
    props: {
        afiliado: Object
    },
    data() {
        return {
            datoSeleccionado: null,
            nuevaObservacion: null,
            dialogObservaciones: false,
            formFiltro: {
                clasificacion_ca_priorizado: null,
                documento: null
            },
            loading: false,
            cie10s: [],
            buscarCie10: null,
            buscar: '',
            historicoDatos: [],
            header: [
                {
                    text: 'CLASIFICACION CA PRIORIZADO',
                    align: 'left',
                    value: 'clasificacion_ca_priorizado',
                    tipo: 'seleccion',
                    elementos: [
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
                { text: 'DEPARTAMENTO', align: 'left', value: 'departamento', tipo: 'visual' },
                { text: 'MUNICIPIO', align: 'left', value: 'municipio', tipo: 'visual' },
                { text: 'IPS', align: 'left', value: 'ips', tipo: 'visual' },
                { text: 'ENTIDAD', align: 'left', value: 'entidad', tipo: 'visual' },
                { text: 'TIPO DE DOCUMENTO', align: 'left', value: 'tipo_documento', tipo: 'visual' },
                { text: 'DOCUMENTO', align: 'left', value: 'documento', tipo: 'visual' },
                { text: 'NOMBRE USUARIO', align: 'left', value: 'nombre_usuario', tipo: 'visual' },
                { text: 'SEXO', align: 'left', value: 'sexo', tipo: 'visual' },
                {
                    text: 'EDAD AL MOMENTO DEL DIAGNOSTICO',
                    align: 'left',
                    value: 'edad_momento_diagnostico',
                    tipo: 'visual'
                },
                { text: 'CICLO DE VIDA', align: 'left', value: 'ciclo_vida', tipo: 'visual' },
                {
                    text: '1ERA CONSULTA MEDICO QUE ORDENA (MAMOGRAFIA, ECOGRAFIA DE MAMA, PSA, ENDOSCOPIA, COLONOSCOPIA, CITOLOGIA, COLPOSCOPIA, PSA, ECOGRAFIA DE PROSTATA, TSH, ECOGRAFIA DE TIROIDES, RX DE TÓRAX, TAC DE TÓRAX',
                    align: 'left',
                    value: 'primera_consulta_medico_ordena',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA CONCULTA INICIAL MEDICO QUE ORDENA LA BIOPSIA',
                    align: 'left',
                    value: 'fecha_consulta_inicial_medico_ordena_biopsia',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA AUTORIZACIÓN DE LA BIOPSIA',
                    align: 'left',
                    value: 'fecha_Autorizacion_biopsia',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA DE LA TOMA DE MUESTRA DE  LA BIOPSIA',
                    align: 'left',
                    value: 'fecha_toma_muestra_biopsia',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA INGRESO DE LA BIOPSIA',
                    align: 'left',
                    value: 'fecha_ingreso_biopsia',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA SALIDA DE LA BIOPSIA ( REPORTE)',
                    align: 'left',
                    value: 'fecha_salida_biopsia_reporte',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA DE DIAGNÓSTICO PATOLOGIA INICIAL',
                    align: 'left',
                    value: 'fecha_diagnostico_patologia_inicial',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA DE DIAGNÓSTICO POR IHQ',
                    align: 'left',
                    value: 'fecha_diagnosticos_ihq',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA DE DIAGNÓSTICO POS OPERATORIO',
                    align: 'left',
                    value: 'fecha_diagnostico_pos_operatorio',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA DE DIAGNÓSTICO POR IHQ POS OPERATORIA',
                    align: 'left',
                    value: 'fecha_diagnostico_por_iht_pos_operatorio',
                    tipo: 'calendario'
                },
                {
                    text: 'FECCHA DEL REPORTE DEL LABORATORIO',
                    align: 'left',
                    value: 'fecha_reporte_laboratorio',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA SOLICITUD 1ERA COSNULTA INGRESO PROGRAMA ONCOLOGIA (SUPERVIVIENTE) MAMA, PROSTATA, GASTRICO, COLO-RECTAL',
                    align: 'left',
                    value: 'fecha_solicitud_primera_consulta_ingreso_programa_oncologia',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA  1ERA COSNULTA INGRESO PROGRAMA ONCOLOGIA (SUPERVIVIENTE) MAMA, PROSTATA, GASTRICO, COLO-RECTAL',
                    align: 'left',
                    value: 'fecha_primera_consulta_ingreso_programa_oncologia',
                    tipo: 'calendario'
                },
                {
                    text: 'OPORTUNIDAD INGRESO PROGRAMA ONCOLOGIA POR MEDICO SUPERVIVIENTE',
                    align: 'left',
                    value: 'oportunidad_ingreso_programa_oncologia_medico_superviviente',
                    tipo: 'visual'
                },
                {
                    text: 'FECHA SOLICITUD 1ERA CONSULTA ESPECIALISTA TRATANTE',
                    align: 'left',
                    value: 'fecha_solicitud_primera_consulta_Especialista_tratante',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA 1ERA CONSULTA CONSULTA ESPECIALISTA TRATANTE',
                    align: 'left',
                    value: 'fecha_primera_consulta_especialista_tratante',
                    tipo: 'calendario'
                },
                {
                    text: 'OPORTUNIDAD DESDE EL DX HASTA LA EVALUACION POR EL ESPECIALISATA',
                    align: 'left',
                    value: 'oportunidad_desde_dx_hasta_Evaluacion_especialista',
                    tipo: 'visual'
                },
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
                    text: 'TIPO DE INICIO DE TTO-MONO-POLI-CX',
                    align: 'left',
                    value: 'tipo_inicio_tto_mono_poli_cx',
                    tipo: 'seleccion',
                    elementos: [
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
                {
                    text: 'ESTADIO', align: 'left', value: 'estadio', tipo: 'seleccion', elementos: [
                        '0', 'I', 'IA', 'IA1', 'IA2', 'IB', 'IB1', 'IB2', 'IB3', 'II', 'IIA', 'IIA1', 'IIA2', 'IIB', 'IIC', 'III', 'IIIA', 'IIIB', 'IIIC', 'IV', 'IVA', 'IVB', 'V'
                    ]
                },
                {
                    text: 'Tipo de Cirugia Conservadora o no  ca de mama',
                    align: 'left',
                    value: 'tipo_cirugia_conservadora_ca_mama',
                    tipo: 'seleccion',
                    elementos: [
                        'Conservadora Cuadrantectomia',
                        'Mastectomia Radical Unilateral',
                        'Mastectomia Radical Bilateral'
                    ]
                },
                {
                    text: 'RIESGO SOLO APLICA EN PROSTATA',
                    align: 'left',
                    value: 'riesgo_aplica_prostata',
                    tipo: 'visual'
                },
                { text: 'Control PSA', align: 'left', value: 'control_psa', tipo: 'calendario' },
                {
                    text: 'CLASIFICACION ANN ARBOR O LUGANO I-II-III-IV',
                    align: 'left',
                    value: 'clasificacion_ann_arbor_lugano',
                    tipo: 'seleccion',
                    elementos: [
                        'I',
                        'II',
                        'III',
                        'IV'
                    ]
                },
                { text: 'RH ESTROGENOS (Positivos y Negativos )', align: 'left', value: 'rh_estrogenos', tipo: 'texto' },
                {
                    text: 'RH PROGESTAGENOS  (Positivos y Negativos )',
                    align: 'left',
                    value: 'rh_progestagenos',
                    tipo: 'texto'
                },
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
                {
                    text: 'REMSION A CONSULTA DE RADIOTERAPIA',
                    align: 'left',
                    value: 'remision_consulta_radioterapia',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA INICIO RADIOTERAPIA',
                    align: 'left',
                    value: 'fecha_inicio_radioterapia',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA INICIO BRAQUITERAPIA',
                    align: 'left',
                    value: 'fecha_inicio_braquiterapia',
                    tipo: 'calendario'
                },
                {
                    text: 'IPS DE DIRECCIONAMIENTO RADIOTERAPIA',
                    align: 'left',
                    value: 'ips_direccionamiento_radioterapia',
                    tipo: 'seleccion',
                    elementos: [
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
                {
                    text: 'FECHA REMISON A MEDICINA DEL DOLOR',
                    align: 'left',
                    value: 'fecha_remision_medicina_dolor',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA PROGRAMACION CITA DOLOR',
                    align: 'left',
                    value: 'fecha_programa_cita_dolor',
                    tipo: 'calendario'
                },
                {
                    text: 'ESTADO DE LA CONSULTA',
                    align: 'left',
                    value: 'estado_consulta',
                    tipo: 'seleccion',
                    elementos: [
                        'Programada',
                        'Atendida',
                        'Cancelada',
                        'inasistida'
                    ]
                },
                {
                    text: 'REMITE A CX DE TORAX',
                    align: 'left',
                    value: 'remite_cx_torax',
                    tipo: 'seleccion',
                    elementos: [
                        'SI',
                        'NO'
                    ]
                },
                {
                    text: 'FECHA PRIMERA CONSULTA CIRUGIA DE TORAX',
                    align: 'left',
                    value: 'fecha_primera_Consulta_cirugia_torax',
                    tipo: 'calendario'
                },
                {
                    text: 'REMISION A ONCOLOGIA O HEMATO-ONCOLOGIA',
                    align: 'left',
                    value: 'remision_oncologia_hemato_oncologia',
                    tipo: 'seleccion',
                    elementos: [
                        'SI',
                        'NO'
                    ]
                },
                {
                    text: 'FECHA 1ERA CONSULTA ONCOLOGIA O HEMATO-ONCOLOGIA',
                    align: 'left',
                    value: 'fecha_primera_consulta_oncologia_hemato_oncologia',
                    tipo: 'calendario'
                },
                {
                    text: 'REMISION A MASTOLOGIA',
                    align: 'left',
                    value: 'remision_mastologia',
                    tipo: 'seleccion',
                    elementos: [
                        'SI',
                        'NO'
                    ]
                },
                {
                    text: 'FECHA 1ERA CONSULTA MASTOLOGIA',
                    align: 'left',
                    value: 'fecha_primera_consulta_mastologia',
                    tipo: 'calendario'
                },
                {
                    text: 'REMITE A CX PLASTICA',
                    align: 'left',
                    value: 'remite_cx_palstica',
                    tipo: 'seleccion',
                    elementos: [
                        'SI',
                        'NO'
                    ]
                },
                {
                    text: 'FECHA 1ERA CONSULTA CIRUGIA PLASTICA',
                    align: 'left',
                    value: 'fecha_primera_consulta_cirugia_plastica',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA  EN QUE SE ORDENA EL 1ER  TTO (Quimio, Cirugia, Radioterapia )',
                    align: 'left',
                    value: 'fecha_ordena_primer_tto',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA EN QUE SE INICIA 1ER TTO (Quimio, Cirugia, Radioterapia )',
                    align: 'left',
                    value: 'fecha_inicia_primer_tto',
                    tipo: 'calendario'
                },
                { text: 'OPORTUNIDAD INICIO 1ER TTO', align: 'left', value: 'oportunidad_inicio_tto', tipo: 'visual' },
                {
                    text: 'FECHA EN QUE SE ORDENA EL 1ER TRATAMIENTO POS (Quimio, Cirugia, Radioterapia )',
                    align: 'left',
                    value: 'fecha_ordena_primer_tratamiento_pos',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA INICIO TTO POS (Quimio, Cirugia, Radioterapia )  (ADYUVANCIA)',
                    align: 'left',
                    value: 'fecha_inicio_tto_pos',
                    tipo: 'calendario'
                },
                {
                    text: 'OPORTUNIDAD TTO POS CX (ADYUVANCIA)',
                    align: 'left',
                    value: 'oportunidad_tto_pos_cx',
                    tipo: 'visual'
                },
                {
                    text: 'FECHA EN QUE SE ORDENA EL 1ER TRATAMIENTO NEOADYUVANTE (Antes de la cirugia )',
                    align: 'left',
                    value: 'fecha_ordena_primer_tratamiento_neoadyuvante',
                    tipo: 'calendario'
                },
                {
                    text: 'FECHA INICIO TTO NEOADYUVANTE',
                    align: 'left',
                    value: 'fecha_inicio_tto_neoadyuvante',
                    tipo: 'calendario'
                },
                { text: 'FECHA FIN TTO NEOADYUVANTE', align: 'left', value: 'fecha_fin_tto_neoadyuvancia', tipo: 'calendario' },
                { text: 'FECHA REALIZACION CIRUGIA', align: 'left', value: 'fecha_realizacion_cirugia', tipo: 'calendario' },
                { text: 'OPORTUNIDAD NEOADYUVNCIA', align: 'left', value: 'oportunidad_neoadyuvante', tipo: 'visual' },
                {
                    text: 'ESTADO DE AFILIACION (VIVO-FALLECIDO)',
                    align: 'left',
                    value: 'estado_afiliado',
                    tipo: 'seleccion',
                    elementos: [
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
                {
                    text: 'CLASIFICACION RIESGO INTERNACIONAL LH LNH',
                    align: 'left',
                    value: 'clasificacion_riesgo_internacional_lh_lnh',
                    tipo: 'texto'
                },
                { text: 'OBSERVACIONES GENERALES', align: 'left', value: 'observaciones_generales', tipo: 'texto' },
                { text: '', align: 'left', value: 'eliminar' }
            ],
            caPriorizados: [
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
        }
    },
    watch: {
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
        this.listarDatos();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),
        listarDatos() {

            this.setPreload(true);
            this.$axios.post('indicadores/registro-afiliado', this.formFiltro).then(res => {
                this.historicoDatos = res.data;
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.setPreload(false);
            })
        },
        save(id, campo, valor) {
            this.setPreload(true);
            let data = {}
            data[campo] = valor;
            this.$axios.put('indicadores/actualizar/' + id, data).then(res => {
                this.$toast.success(res.data.mensaje);
                this.nuevaObservacion = null;
            }).catch(e => console.log()).finally(() => this.setPreload(false))
        },
        cancel() {
        },
        open() {
        },
        close() {
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
        eliminarRegistro(item) {
            this.$axios.delete('indicadores/' + item.id).then(res => {
                this.$toast.success(res.data.mensaje);
                this.listarDatos();
            }).catch(err => {
                console.log(err)
                this.$toast.error(err.response.data.mensaje)
            }).finally(() => {
                this.setPreload(false);
                this.loading = false;
            })
        },
        agregarObservacion() {
            if (!this.nuevaObservacion) {
                return this.$toast.error('El campo "Nueva Observacion" es requerido.');
            }
            const fechaActual = this.$moment().format('YYYY-MM-DD HH:mm');
            let arrDatos = [];
            if (this.historicoDatos[this.datoSeleccionado]['observaciones_generales']) {
                if (this.isJsonString(this.historicoDatos[this.datoSeleccionado]['observaciones_generales'])) {
                    arrDatos = JSON.parse(this.historicoDatos[this.datoSeleccionado]['observaciones_generales']);
                } else {
                    arrDatos.push({
                        fecha: '2025-02-01 08:00',
                        observacion: this.historicoDatos[this.datoSeleccionado]['observaciones_generales'],
                        responsable: 'Ingreso Carga Masiva'
                    })
                }
            }
            let objNuevo = {
                fecha: fechaActual,
                observacion: this.nuevaObservacion,
                responsable: [
                    this.$store.state.auth.usuario.operador?.nombre,
                    this.$store.state.auth.usuario.operador?.apellido
                ].filter(Boolean).join(' ') || 'Sin nombre',
            };
            arrDatos.push(objNuevo);
            this.historicoDatos[this.datoSeleccionado]['observaciones_generales'] = JSON.stringify(arrDatos);
            this.save(this.historicoDatos[this.datoSeleccionado]['id'], 'observaciones_generales', JSON.stringify(arrDatos));
        },
        isJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

    }
}
</script>
<style scoped>
td {
    min-width: 300px;
}
</style>
