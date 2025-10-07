<template>
    <v-form ref="form" class="my-2">
        <v-row dense>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="blue-grey" border="left">
                    <b>
                        4.1 CARACTERÍSTICAS Y CONDICIONES DEL ENTORNO Y DE LA VIVIENDA
                    </b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="Tipo de Vivienda *" :items="tipo_vivienda.opciones"
                    v-model="caracterizacion.tipo_vivienda" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál?" v-model="caracterizacion.tipo_vivienda_otro"
                    :disabled="caracterizacion.tipo_vivienda !== 'Otro'" :rules="[validarTipoViviendaOtro]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="¿Cuál es el material predominante de las paredes? *"
                    :items="material_paredes.opciones" v-model="caracterizacion.material_paredes"
                    :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál?" v-model="caracterizacion.material_paredes_otro"
                    :disabled="caracterizacion.material_paredes !== 'Otro'" :rules="[validarMaterialParedesOtro]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="¿Cuál es el material predominante del piso de la vivienda? *"
                    :rules="[rules.obligatorio]" :items="material_piso.opciones" v-model="caracterizacion.material_piso" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined label="¿Cuál?" auto-grow v-model="caracterizacion.material_piso_otro"
                    :disabled="caracterizacion.material_piso !== 'Otro'" :rules="[validarMaterialPisoOtro]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="¿Cuál es el material predominante del techo de la vivienda? *"
                    :items="material_techo.opciones" v-model="caracterizacion.material_techo" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál?" v-model="caracterizacion.material_techo_otro"
                    :disabled="caracterizacion.material_techo !== 'Otro'" :rules="[validarMaterialTechoOtro]" />
            </v-col>
            <v-col cols="12" sm="6" md="6">
                <v-text-field dense outlined type="number" min="0"
                    label="¿De cuántos cuartos o piezas dormitorio dispone esta vivienda? *"
                    v-model="caracterizacion.cuartos_dormitorio" :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="6" md="6">
                <v-select dense outlined label="Hacinamiento *" :items="opcionesSiNo" v-model="caracterizacion.hacinamiento"
                    :rules="[rules.obligatorio]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select multiple dense outlined small-chips chips deletable-chips
                    label="Se identifican algunos de los siguientes escenarios de riesgo de accidente en la vivienda *"
                    :rules="[rules.alMenosUnElemento]" :items="escenarios_riesgo.opciones"
                    v-model="caracterizacion.escenarios_riesgo" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="Desde la vivienda se puede acceder fácilmente a: *"
                    :rules="[rules.obligatorio]" :items="acceder_facilmente.opciones"
                    v-model="caracterizacion.acceder_facilmente" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="¿Cuál es la fuente de energía o combustible que se usa para cocinar? *"
                    :rules="[rules.obligatorio]" :items="fuente_energia_cocinar.opciones"
                    v-model="caracterizacion.fuente_energia_cocinar" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál?" :rules="[validarFuenteEnergiaCocinarOtro]"
                    v-model="caracterizacion.fuente_energia_cocinar_otro"
                    :disabled="caracterizacion.fuente_energia_cocinar !== 'Otro'" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="¿Se observa cerca de la vivienda o dentro de ellas criaderos que pueden favorecer la presencia de vectores transmisores de enfermedades? *"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.criaderos_transmisores_enfermedades" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál(es)?" v-model="caracterizacion.criaderos_cuales"
                    :disabled="caracterizacion.criaderos_transmisores_enfermedades !== true"
                    :rules="[validarCriaderosCuales]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="blue-grey" border="left">
                    <b>
                        4.2 OFICIOS U OCUPACIONES QUE SE DESARROLLAN EN LA VIVIENDA O SU ENTORNO INMEDIATO (PERI
                        DOMICILIO)
                    </b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined multiple
                    label="Observe si cerca de la vivienda hay alguno de los siguientes: *"
                    :items="factores_entorno_vivienda.opciones" v-model="caracterizacion.factores_entorno_vivienda"
                    :rules="[rules.alMenosUnElemento]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál otro?"
                    v-model="caracterizacion.factores_entorno_vivienda_otro" :rules="[validarFactoresEntornoOtro]"
                    :disabled="!caracterizacion.factores_entorno_vivienda !== 'Otro'" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="¿Al interior de la vivienda se realiza alguna actividad económica?"
                    :rules="[rules.obligatorio]" :items="opcionesSiNo"
                    v-model="caracterizacion.vivienda_realiza_actividad_economica" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="Señale los animales que conviven con la familia dentro de la vivienda o en su entorno inmediato, e indique cuantos son: *"
                    :rules="[rules.obligatorio]" :items="animales_conviven.opciones"
                    v-model="caracterizacion.animales_conviven" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál?" v-model="caracterizacion.animales_conviven_otro"
                    :rules="[validarAnimalesConvivenOtro]" :disabled="caracterizacion.animales_conviven !== 'Otro'" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-text-field dense outlined type="number" min="0" label="Registrar Cantidad"
                    v-model="caracterizacion.animales_conviven_cantidad" :rules="[validarCantidadAnimalesConviven]"
                    :disabled="caracterizacion.animales_conviven !== 'Otro'" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text color="blue-grey" border="left">
                    <b>
                        4.3 AGUA Y SANEAMIENTO BÁSICO
                    </b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="¿Cuál es la principal fuente de abastecimiento de agua para consumo humano en la vivienda? *"
                    :rules="[rules.obligatorio]" :items="fuente_agua.opciones" v-model="caracterizacion.fuente_agua" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál?" v-model="caracterizacion.fuente_agua_otro"
                    :disabled="caracterizacion.fuente_agua !== 'Otro'" :rules="[validarFuenteAguaOtro]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined label="¿Cuál es el sistema de disposición de excretas en la vivienda? *"
                    :rules="[rules.obligatorio]" :items="sistema_disposicion_excretas.opciones"
                    v-model="caracterizacion.sistema_disposicion_excretas" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál?" v-model="caracterizacion.sistema_disposicion_excretas_otro"
                    :disabled="caracterizacion.sistema_disposicion_excretas !== 'Otro'"
                    :rules="[validarSistemaDisposicionExcretas]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="¿Cuál es el sistema de disposición de aguas residuales domésticas en la vivienda? *"
                    :rules="[rules.obligatorio]" :items="sistema_disposicion_aguas_residuales.opciones"
                    v-model="caracterizacion.sistema_disposicion_aguas_residuales" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál?"
                    v-model="caracterizacion.sistema_disposicion_aguas_residuales_otro"
                    :disabled="caracterizacion.sistema_disposicion_aguas_residuales !== 'Otro'"
                    :rules="[validarSistemaDisposicionAguasResiduales]" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-select dense outlined
                    label="¿Como se realiza la disposición final de los residuos sólidos ordinarios de la vivienda? *"
                    :rules="[rules.obligatorio]" :items="sistema_disposicion_residuos.opciones"
                    v-model="caracterizacion.sistema_disposicion_residuos" />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea dense outlined auto-grow label="¿Cuál?" v-model="caracterizacion.sistema_disposicion_residuos_otro"
                    :disabled="caracterizacion.sistema_disposicion_residuos !== 'Otro'"
                    :rules="[validarSistemaDisposicionResiduos]" />
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
export default {
    props: {
        caracterizacion: {
            type: Object,
            default: null
        },
        rules: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            opcionesSiNo: [
                { text: 'SI', value: true },
                { text: 'NO', value: false }
            ],
            tipo_vivienda: {
                opciones: [
                    'Casa', 'Casa Indígena', 'Carpa', 'Apartamento',
                    'Pieza/Cuarto en Inquilinato', 'Contenedor', 'Embarcación',
                    'Vagón', 'Refugio Natural', 'Cueva', 'Puente', 'Otro'
                ]
            },
            material_paredes: {
                opciones: [
                    'Bloque, ladrillo, piedra, madera pulida',
                    'Tapia pisada, adobe',
                    'Bahareque',
                    'Material prefabricado',
                    'Madera burda, tabla, tablón',
                    'Guadua, casa, esterilla, otro vegetal',
                    'Zinc, tela, lona, cartón, latas, desechos, plástico',
                    'Sin paredes',
                    'Otro'
                ]
            },
            material_piso: {
                opciones: [
                    'Alfombra o tapete, marmol parque, madera pulida y lacada',
                    'Baldosa, vinilo, tableta o ladrillo', 'Cemento, gravilla',
                    'Cemento, gravilla',
                    'Madera burda, maedraen mal estado, tabla, tablón',
                    'Tierra o arena',
                    'Otro'
                ]
            },
            material_techo: {
                opciones: [
                    'Concreto',
                    'Tejas de barro',
                    'Fibrocemento',
                    'Zinc',
                    'Palma o paja',
                    'Plástico',
                    'Desechos (Cartón, lata, tela, sacos, etc)',
                    'Otro'
                ]
            },
            escenarios_riesgo: {
                opciones: [
                    'Objetos cortantes o punzantes al alcance de los niños',
                    'Sustancias químicas al alcance de los niños',
                    'Medicamentos al alcance de los niños',
                    'Velas, velones, inciensos encendidos en la vivienda',
                    'Conexiones eléctricas en mal estado o sobrecargadas',
                    'Botones, canicas entre otros objetos pequeños o con piezas que puedan desmontarse, al alcance de los niños',
                    'Pasillos obstruidos con juguetes, sillas u otros objetos',
                    'Superficies resbaladizas, suelos con agua, grasas, aceites, entre otros',
                    'Tanques o recipientes de almacenamiento de agua sin tapa',
                    'Escaleras sin protección',
                    'Ninguno'
                ]
            },
            acceder_facilmente: {
                opciones: [
                    'Medios de transporte (Buses, autos, camiones, lanchas, etc)',
                    'Parques, y áreas deportivas, Centros sociales y/o recreacionales',
                    'Instituciones educativas',
                    'Servicios de salud',
                    'Ninguna'
                ]
            },
            fuente_energia_cocinar: {
                opciones: [
                    'Electricidad',
                    'Gas natural',
                    'Gas líquido del petróleo (gas propano)',
                    'Leña, madera o carbón de leña',
                    'Petróleo, gasolina, kerosén, alcohol',
                    'Carbón mineral',
                    'Minerales de desecho',
                    'Otro'
                ]
            },
            factores_entorno_vivienda: {
                opciones: [
                    'Cultivos',
                    'Apriscos',
                    'Porquerizas',
                    'Galpones',
                    'Terrenos baldíos',
                    'Presencia de Plagas: roedores, cucarachas, zancudos, moscas, etc',
                    'Ruido o sonidos desagradables',
                    'Malos olores',
                    'Sitios satélites de disposición de excretas',
                    'Rellenos sanitarios/botaderos',
                    'Industrias Contaminantes (energético, minero, transporte, etc)',
                    'Contaminación visual',
                    'Río o quebrada',
                    'Planta de tratamiento de agua residual',
                    'Extracción minera',
                    'Canales de agua lluvia',
                    'Vías de tráfico vehicular',
                    'Quemas a cielo abierto',
                    'Otro'
                ]
            },
            animales_conviven: {
                opciones: [
                    'Perros',
                    'Gatos',
                    'Porcinos',
                    'Bóvidos: Búfalos, vacas, toros',
                    'Equinos: Asnos, mulas, caballos, burros',
                    'Ovinos / Caprino',
                    'Aves de producción',
                    'Aves ornamentales',
                    'Peces ornamentales, Hámsters',
                    'Cobayos, conejos',
                    'Animales silvestres',
                    'Otro',
                    'Ninguno'
                ]
            },
            fuente_agua: {
                opciones: [
                    'Acueducto administrado por empresa prestadora (ESP)',
                    'Agua embotellada',
                    'Acueducto veredal comunitario',
                    'Pila pública',
                    'Carro tanque',
                    'Abasto con distribución comunitaria',
                    'Pozo con bomba',
                    'Pozo sin bomba, aljibe, jagüey o barreno',
                    'Laguna o jagüey',
                    'Río, quebrada, manantial, o nacimiento',
                    'Aguas lluvias',
                    'Aguatero',
                    'Otro'
                ]
            },
            sistema_disposicion_excretas: {
                opciones: [
                    'Sanitario conectado al alcantarillado',
                    'Sanitario y letrina',
                    'Sanitario conectado a pozo séptico',
                    'Sanitario ecológico seco',
                    'Sanitario sin conexión',
                    'Sanitario con disposición a fuente hídrica',
                    'Campo abierto',
                    'Otro'
                ]
            },
            sistema_disposicion_aguas_residuales: {
                opciones: [
                    'Alcantarillado', 'Pozo séptico', 'Campo de oxidación', 'Biofiltro', 'Fuente hídrica', 'Campo abierto', 'Otro'
                ]
            },
            sistema_disposicion_residuos: {
                opciones: [
                    'Recolección por parte del servicio de aseo distrital o municipal',
                    'Enterramiento',
                    'Quema a campo abierto',
                    'Disposición en fuentes de agua cercana',
                    'Disposición a campo abierto',
                    'Otro'
                ]
            }
        }
    },
    computed: {
        validarTipoViviendaOtro() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.tipo_vivienda,
                opcionesValidas: ['Otro'],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Debe especificar el tipo de vivienda si seleccionó "Otro". Mínimo 5 caracteres.'
            });
        },

        validarMaterialParedesOtro() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.material_paredes,
                opcionesValidas: ['Otro'],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Debe especificar el material predominante de las paredes si seleccionó "Otro". Mínimo 5 caracteres.'
            });
        },

        validarMaterialPisoOtro() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.material_piso,
                opcionesValidas: ['Otro'],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Debe especificar el material predominante del piso si seleccionó "Otro". Mínimo 5 caracteres.'
            });
        },

        validarMaterialTechoOtro() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.material_techo,
                opcionesValidas: ['Otro'],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Debe especificar el material predominante del techo si seleccionó "Otro". Mínimo 5 caracteres.'
            });
        },

        validarFuenteEnergiaCocinarOtro() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.fuente_energia_cocinar,
                opcionesValidas: ['Otro'],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Debe especificar la fuente de energía para cocinar si seleccionó "Otro". Mínimo 5 caracteres.'
            });
        },

        validarCriaderosCuales() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.criaderos_transmisores_enfermedades,
                opcionesValidas: [true],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Debe especificar los criaderos si seleccionó "Sí". Mínimo 5 caracteres.'
            });
        },

        validarFactoresEntornoOtro() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.factores_entorno_vivienda,
                opcionesValidas: ['19. Otro'],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Debe especificar el otro factor si seleccionó "Otro". Mínimo 5 caracteres.'
            });
        },

        validarAnimalesConvivenOtro() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.animales_conviven,
                opcionesValidas: ['Otro'],
                reglaBase: v => !!v && v.length >= 3,
                mensaje: 'Debe especificar el tipo de animal si seleccionó "Otro".'
            });
        },

        validarCantidadAnimalesConviven() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.animales_conviven,
                opcionesValidas: ['Otro'],
                reglaBase: v => v !== null && v !== '' && !isNaN(v) && Number(v) > 0,
                mensaje: 'Debe registrar la cantidad si seleccionó "Otro".'
            });
        },

        validarFuenteAguaOtro() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.fuente_agua,
                opcionesValidas: ['Otro'],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Debe especificar la fuente de agua si seleccionó "Otro". Mínimo 5 caracteres.'
            });
        },

        validarSistemaDisposicionExcretas() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.sistema_disposicion_excretas,
                opcionesValidas: ['Otro'],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Debe especificar el sistema de disposición de excretas si seleccionó "Otro". Mínimo 5 caracteres.'
            });
        },

        validarSistemaDisposicionAguasResiduales() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.sistema_disposicion_aguas_residuales,
                opcionesValidas: ['Otro'],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Debe especificar el sistema de disposición de aguas residuales si seleccionó "Otro". Mínimo 5 caracteres.'
            });
        },

        validarSistemaDisposicionResiduos() {
            return this.campoCondicional({
                valorControlador: this.caracterizacion.sistema_disposicion_residuos,
                opcionesValidas: ['Otro'],
                reglaBase: v => !!v && v.length >= 5,
                mensaje: 'Debe especificar el sistema de disposición de residuos si seleccionó "Otro". Mínimo 5 caracteres.'
            });
        }
    },
    watch: {
        'caracterizacion.material_techo': {
            handler(nuevoValor) {
                if (nuevoValor !== 'Otro') {
                    this.caracterizacion.material_techo_otro = '';
                }
            },
            immediate: true
        },
        'caracterizacion.tipo_vivienda': {
            handler(nuevoValor) {
                if (nuevoValor !== 'Otro') {
                    this.caracterizacion.tipo_vivienda_otro = '';
                }
            },
            immediate: true
        },
        'caracterizacion.material_paredes': {
            handler(nuevoValor) {
                if (nuevoValor !== 'Otro') {
                    this.caracterizacion.material_paredes_otro = '';
                }
            },
            immediate: true
        },
        'caracterizacion.material_piso': {
            handler(nuevoValor) {
                if (nuevoValor !== 'Otro') {
                    this.caracterizacion.material_piso_otro = '';
                }
            },
            immediate: true
        },
        'caracterizacion.fuente_energia_cocinar': {
            handler(nuevoValor) {
                if (nuevoValor !== 'Otro') {
                    this.caracterizacion.fuente_energia_cocinar_otro = '';
                }
            },
            immediate: true
        },
        'caracterizacion.criaderos_transmisores_enfermedades': {
            handler(nuevoValor) {
                if (nuevoValor !== true) {
                    this.caracterizacion.criaderos_cuales = '';
                }
            },
            immediate: true
        },
        'caracterizacion.factores_entorno_vivienda': {
            handler(nuevoValor) {
                if (nuevoValor !== 'Otro') {
                    this.caracterizacion.factores_entorno_vivienda_otro = '';
                }
            },
            immediate: true
        },
        'caracterizacion.animales_conviven': {
            handler(nuevo) {
                if (nuevo !== 'Otro') {
                    this.caracterizacion.animales_conviven_otro = '';
                    this.caracterizacion.animales_conviven_cantidad = '';
                }
            },
            immediate: true
        },
        'caracterizacion.fuente_agua': {
            handler(nuevo) {
                if (nuevo !== 'Otro') {
                    this.caracterizacion.fuente_agua_otro = '';
                }
            },
            immediate: true
        },
        'caracterizacion.sistema_disposicion_excretas': {
            handler(nuevo) {
                if (nuevo !== 'Otro') {
                    this.caracterizacion.sistema_disposicion_excretas_otro = '';
                }
            },
            immediate: true
        },
        'caracterizacion.sistema_disposicion_aguas_residuales': {
            handler(nuevo) {
                if (nuevo !== 'Otro') {
                    this.caracterizacion.sistema_disposicion_aguas_residuales_otro = '';
                }
            },
            immediate: true
        },
        'caracterizacion.sistema_disposicion_residuos': {
            handler(nuevo) {
                if (nuevo !== 'Otro') {
                    this.caracterizacion.sistema_disposicion_residuos_otro = '';
                }
            },
            immediate: true
        }
    },
    methods: {
        campoCondicional({ valorControlador, opcionesValidas, reglaBase, mensaje }) {
            return v => {
                if (!opcionesValidas.includes(valorControlador)) return true;
                return typeof reglaBase === 'function'
                    ? reglaBase(v) || mensaje
                    : (!!v || mensaje);
            };
        }
    }
}
</script>