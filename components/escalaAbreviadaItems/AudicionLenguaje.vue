<template>
    <div>
        <v-form ref="AudicionLenguaje" lazy-validation>
        <v-col cols="12" sm="12" md="12">
            <v-alert class="text-center" dense text type="warning" icon="mdi-book-open-page-variant">
                <b>AUDICIÓN LENGUAJE</b>
            </v-alert>
        </v-col>
        <template>
            <div class="mb-4">
                <v-row>
                    <v-col v-for="(item, index) in datosEscala.slice(0, 4)" :key="index" cols="12" sm="6" md="3">
                        <v-alert text dense border="left" color="info" icon="mdi-information-box-outline">
                            <b>Fecha Consulta:</b> {{ new Date(item.created_at).toLocaleDateString() }} <br>
                            Punto de inicio: {{ item.punto_inicio_audicion_lenguaje }} <br>
                            Puntuación directa: {{ item.puntuacion_directa_audicion_lenguaje}} <br>
                            Puntuación total: {{ item.puntuacion_total_audicion_lenguaje }} 
                        </v-alert>
                    </v-col>
                </v-row>
            </div>
        </template>
        <v-row>
            <v-col cols="12" sm="12" md="12">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 10%">
                                    RANGO EDAD
                                </th>
                                <th class="text-center" style="width: 10%">
                                    N° ITEM
                                </th>
                                <th class="text-center" style="width: 72%">
                                    ENUNCIADO
                                </th>
                                <th class="text-center" style="width: 1%">1</th>
                                <th class="text-center" style="width: 1%">0</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="valores in escala.lenguaje" v-if="
                                  parseInt(valores.rango) ===
                                  parseInt(edadCumplida)
                              ">
                                <td class="text-center">
                                    <h1>{{ valores.rango }}</h1>
                                    <div class="my-2">
                                        <v-btn :disabled="desactivarBotonRango" color="primary" fab x-small dark
                                            @click="disminuirRangoEdad()">
                                            <v-icon>mdi-menu-up</v-icon>
                                        </v-btn>
                                        <v-btn color="primary" fab x-small dark @click="aumentarRangoEdad()">
                                            <v-icon>mdi-menu-down</v-icon>
                                        </v-btn>
                                        <v-btn color="success" fab x-small dark @click="reiniciarValoracion()">
                                          <v-icon>mdi-reload</v-icon>
                                      </v-btn>
                                    </div>
                                </td>
                                <td class="text-center">
                                    <v-col v-for="componente in valores.componentes" :key="componente.item" cols="12"
                                        sm="12" md="12">
                                        <h3>{{ componente.item }}</h3>
                                    </v-col>
                                </td>
                                <td class="text-left">
                                    <v-col v-for="componente in valores.componentes" :key="componente.item" cols="12"
                                        sm="12" md="12">
                                        {{ componente.enunciado }}
                                    </v-col>
                                </td>
                                <template>
                                    <td class="text-center" style="
                                          width: 5px;
                                          padding-left: 0px;
                                          padding-right: 0px;
                                      ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotones" v-model="componente.valor1"
                                                type="radio"
                                                :name="'lenguaje' + valores.rango +componente.item + 'valor1' "
                                                value="1"
                                                @change="condicionValorItem(componente.item,valores.componentes, '1', 1)" />
                                        </v-col>
                                    </td>
                                    <td class="text-center" style="
                                          width: 5px;
                                          padding-left: 0px;
                                          padding-right: 0px;
                                      ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotones" v-model="componente.valor1"
                                                type="radio"
                                                :name="'lenguaje' + valores.rango +componente.item +'valor1'" value="0"
                                                @change="condicionValorItem(componente.item,valores.componentes,'0',0)" />
                                        </v-col>
                                    </td>
                                </template>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <v-col cols="12" sm="12" md="6" offset-md="6" class="text-center">
            <v-spacer></v-spacer>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td class="text-left">
                                Total acumulado al inicio (PI)
                            </td>
                            <td class="text-left">
                                {{ punto_inicio_audicion_lenguaje }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Número de ítems correctos</td>
                            <td class="text-left">
                                {{ totalCorrectos("lenguaje", "valor1") }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Total (PD)</td>
                            <td class="text-left">
                                {{  puntuacion_directa_audicion_lenguaje }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">PT (Puntuación Total)</td>
                            <td class="text-left">
                                {{ puntuacionTotal }}
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-col>
        <v-alert text dense :color="colorResultado(resultadoAudicionLenguaje)" border="left" class="text-center" icon="mdi-information"
            v-if="puntuacionTotal != null">
            <b>Puntuación:</b><br>
            {{ alertaResultado }}<br>
        </v-alert>
        </v-form>
    </div>
</template>
<script>
    import {
        mapActions
    } from "vuex";

    export default {
        name: 'AudicionLenguaje',
        props: ['datos', 'resumen', 'datosEscala','conversion'],
        data() {
            return {
                resultadoAudicionLenguaje: null,
                alertaResultado: null,
                puntuacionTotal: null,
                tipo_escala:3,
                desactivarBotones: false,
                desactivarBotonRango: false,
                contadorCeros: 0,
                punto_inicio_audicion_lenguaje: null,
                contadorSeleccion: 0,
                contadorTotal: 0,
                edadCumplida: 0,
                edadCumplidaFija: 0,
                edadCumplidaRango: "",
                fecha_nacimiento: 0,
                escala: {
                    lenguaje: [{
                            rango: '1',
                            componentes: [{
                                    item: '1',
                                    enunciado: 'Se sobresalta con un ruido.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '2',
                                    enunciado: 'Contempla momentáneamente a una persona.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '3',
                                    enunciado: 'Llora para expresar necesidades.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                        {
                            rango: '2',
                            componentes: [{
                                    item: '4',
                                    enunciado: 'Se tranquiliza con la voz humana.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '5',
                                    enunciado: 'Produce sonidos guturales indiferenciados.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '6',
                                    enunciado: 'Busca el sonido con la mirada.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                        {
                            rango: '3',
                            componentes: [{
                                    item: '7',
                                    enunciado: 'Busca diferentes sonidos con la mirada.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '8',
                                    enunciado: 'Pone atención a la conversación.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '9',
                                    enunciado: 'Produce cuatro o más sonidos diferentes.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                        {
                            rango: '4',
                            componentes: [{
                                    item: '10',
                                    enunciado: 'Pronuncia tres o más sílabas.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '11',
                                    enunciado: 'Reacciona cuando se le llama por su nombre.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '12',
                                    enunciado: 'Reacciona a tres palabras familiares.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                        {
                            rango: '5',
                            componentes: [{
                                    item: '13',
                                    enunciado: 'Reacciona a la palabra no.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '14',
                                    enunciado: 'Llama al cuidador.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '15',
                                    enunciado: 'Responde a una instrucción sencilla.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                        {
                            rango: '6',
                            componentes: [{
                                    item: '16',
                                    enunciado: 'Aproximación a una palabra con intención comunicativa.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '17',
                                    enunciado: 'Reconoce al menos 6 objetos o imágenes.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '18',
                                    enunciado: 'Sigue instrucciones de dos pasos.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                        {
                            rango: '7',
                            componentes: [{
                                    item: '19',
                                    enunciado: 'Nombra cinco objetos de una imagen.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '20',
                                    enunciado: 'Utiliza más de 20 palabras',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '21',
                                    enunciado: 'Usa frase de dos palabras.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                        {
                            rango: '8',
                            componentes: [{
                                    item: '22',
                                    enunciado: 'Dice su nombre completo.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '23',
                                    enunciado: 'Dice frases de 3 palabras.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '24',
                                    enunciado: 'Reconoce cualidades de los objetos.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                        {
                            rango: '9',
                            componentes: [{
                                    item: '25',
                                    enunciado: 'Define por su uso cinco objetos.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '26',
                                    enunciado: 'Hace comparativos.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '27',
                                    enunciado: 'Describe el dibujo.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                        {
                            rango: '10',
                            componentes: [{
                                    item: '28',
                                    enunciado: 'Reconoce 5 colores.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '29',
                                    enunciado: 'Responde tres preguntas sobre un relato.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '30',
                                    enunciado: 'Elabora un relato a partir de una imagen.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                        {
                            rango: '11',
                            componentes: [{
                                    item: '31',
                                    enunciado: 'Expresa opiniones.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '32',
                                    enunciado: 'Repite palabras con pronunciación correcta.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '33',
                                    enunciado: 'Absurdos visuales.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                        {
                            rango: '12',
                            componentes: [{
                                    item: '34',
                                    enunciado: 'Identifica palabras que inician con sonidos parecidos.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '35',
                                    enunciado: 'Conoce: ayer, hoy y mañana.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                                {
                                    item: '36',
                                    enunciado: 'Ordena una historia y la relata.',
                                    valor1: null,
                                    valor2: null,
                                    valor3: null,
                                    valor4: null
                                },
                            ]
                        },
                    ],
                }
            }
        },
        mounted() {
            this.fecha_nacimiento = this.datos.afiliado.fecha_nacimiento;
            this.$nextTick(() => {
                this.fechaNacimiento(this.fecha_nacimiento);
                this.rangoEdad(this.edadCumplidaRango);
                this.tipoEscalaAudicion();

            });
            this.listarEscalas();
        },

        watch: {
            puntuacion_directa_audicion_lenguaje(nuevoValor) {
                this.$emit("actualizarDatosAudicionLenguaje", {
                    punto_inicio_audicion_lenguaje: this.punto_inicio_audicion_lenguaje,
                    puntuacion_directa_audicion_lenguaje: nuevoValor
                });
            },
            conversion: {
                immediate: true,
                handler(newVal) {
                    this.puntuacionTotal = newVal?.audicion_lenguaje?.[0]?.puntuacion_total || null;
                    this.resultadoAudicionLenguaje = newVal ?.audicion_lenguaje?.[0] ?.resultado_final || null;

                    if(this.resultadoAudicionLenguaje == 'Alto'){
                        this.alertaResultado = 'Desarrollo esperado para la edad';
                    }if(this.resultadoAudicionLenguaje == 'Medio'){
                        this.alertaResultado = 'Riesgo de problemas de desarrollo';
                    }if(this.resultadoAudicionLenguaje == 'Bajo'){
                        this.alertaResultado = 'Sospecha de problemas de desarrollo';
                    }

                    this.$emit("EnvioResultadoAudicionLenguaje",this.resultadoAudicionLenguaje,
                );
                }
            },
            puntuacionTotalAudicionLenguaje(nuevoValorM){
                this.$emit("puntuacionTotalAudicionLenguaje", {
                    puntuacion_total_audicion_lenguaje: nuevoValorM
                });
            }
        },
        computed: {
            puntuacion_directa_audicion_lenguaje() {
                return (parseInt(this.punto_inicio_audicion_lenguaje) || 0) + (parseInt(this.totalCorrectos("lenguaje",
                    "valor1")) || 0);
            },
            puntuacionTotalAudicionLenguaje() {
                return this.puntuacionTotal;
            },
        },


        methods: {
            ...mapActions("app", ["setPreload"]),
            colorResultado(resultadoAudicionLenguaje) {
                if (resultadoAudicionLenguaje === 'Alto') return '#3bfd47'; // verde
                if (resultadoAudicionLenguaje === 'Medio') return '#ffeb3b'; // amarillo
                if (resultadoAudicionLenguaje === 'Bajo') return '#f44336'; // rojo
                return '#ccc'; // color por defecto
            },
            tipoEscalaAudicion() {
                this.$emit('tipoEscalaAudicion', this.tipo_escala);
            },
            aumentarRangoEdad() {
                if (this.edadCumplida != 12) {
                    this.edadCumplida++;
                }
            },
            disminuirRangoEdad() {
                if (this.edadCumplida != 1) {
                    this.edadCumplida--;
                }
            },
            listarEscalas() {
                this.setPreload(true);
                this.$axios
                    .get("historia/listar-escala-abreviada/" + this.datos.id)
                    .then((res) => {
                        res.data.forEach((s) => {
                            let categoria = "gruesa";
                            switch (s.categoria) {
                                case "MOTRICIDAD FINOADAPTATIVA":
                                    categoria = "finoadaptativa";
                                    break;
                                case "AUDICION LENGUAJE":
                                    categoria = "lenguaje";
                                    break;
                                case "PERSONAL SOCIAL":
                                    categoria = "social";
                                    break;
                            }
                            const idRango = this.escala.gruesa.findIndex(
                                (f) => f.rango === s.rango
                            );
                            const idComponente = this.escala.gruesa[
                                idRango
                            ].componentes.findIndex((f2) => f2.item === s.item);
                            this.escala[categoria][idRango].componentes[
                                idComponente
                            ].valor1 = s.valor_1;
                            this.escala[categoria][idRango].componentes[
                                idComponente
                            ].valor2 = s.valor_2;
                            this.escala[categoria][idRango].componentes[
                                idComponente
                            ].valor3 = s.valor_3;
                            this.escala[categoria][idRango].componentes[
                                idComponente
                            ].valor4 = s.valor_4;
                        });
                    })
                    .catch((e) => console.log(e.response))
                    .finally(() => this.setPreload(false));
            },
            totalValorados(escala, valor) {
                let total = 0;
                this.escala[escala].forEach((s) => {
                    s.componentes.forEach((s2) => {
                        if (s2[valor] !== null) {
                            total++;
                        }
                    });
                });
                return total;
            },
            totalCorrectos(escala, valor) {
                let total = 0;
                this.escala[escala].forEach((s) => {
                    s.componentes.forEach((s2) => {
                        if (s2[valor] !== null && parseInt(s2[valor]) === 1) {
                            total++;
                        }
                    });
                });
                return total;
            },
            fechaNacimiento(fecha) {
                let fechaActual = new Date();
                let fechaNacimiento = new Date(fecha);

                let edadAnios =
                    fechaActual.getFullYear() - fechaNacimiento.getFullYear();
                let edadMeses =
                    fechaActual.getMonth() -
                    fechaNacimiento.getMonth() +
                    edadAnios * 12;
                let dia = fechaActual.getDate() - fechaNacimiento.getDate();

                if (dia < 0) {
                    edadMeses--;
                }
                if (edadMeses <= 24) {
                    return (this.edadCumplidaRango =
                        this.datos.afiliado.edad_cumplida =
                        `${edadMeses} meses`);
                } else {
                    return (this.edadCumplidaRango =
                        this.datos.afiliado.edad_cumplida =
                        `${Math.floor(edadMeses / 12)} años`);
                }
            },
            rangoEdad(edadCumplidaRango) {
                let meses = this.convertirAmeses(edadCumplidaRango);

                const rangos = [{
                        min: 0,
                        max: 1,
                        valor: 1
                    },
                    {
                        min: 1,
                        max: 3,
                        valor: 2
                    },
                    {
                        min: 3,
                        max: 6,
                        valor: 3
                    },
                    {
                        min: 6,
                        max: 9,
                        valor: 4
                    },
                    {
                        min: 9,
                        max: 12,
                        valor: 5
                    },
                    {
                        min: 12,
                        max: 18,
                        valor: 6
                    },
                    {
                        min: 18,
                        max: 24,
                        valor: 7
                    },
                    {
                        min: 24,
                        max: 36,
                        valor: 8
                    },
                    {
                        min: 36,
                        max: 48,
                        valor: 9
                    },
                    {
                        min: 48,
                        max: 60,
                        valor: 10
                    },
                    {
                        min: 60,
                        max: 72,
                        valor: 11
                    },
                    {
                        min: 72,
                        max: 84,
                        valor: 12
                    },
                ];

                const resultado = rangos.find(
                    (r) => meses > r.min && meses <= r.max
                );
                this.edadCumplidaFija = resultado ? resultado.valor : 0;

                return (this.edadCumplida = resultado ? resultado.valor : 0);
            },

            convertirAmeses(edad) {
                let partes = edad.split(" ");
                let valor = parseInt(partes[0]);
                let unidad = partes[1];

                if (unidad.includes("mes")) return valor;
                if (unidad.includes("año")) return valor * 12;
                return 0;
            },
            condicionValorItem(item, componente, valor, index) {
                if (componente[0].valor1 === "0" && this.edadCumplida != 1 && this.edadCumplidaFija === this
                    .edadCumplida && componente[1].valor1 === null && componente[2].valor1 === null) {
                    this.contadorSeleccion = 0;
                    this.edadCumplida--;
                    this.contadorTotal = 0;
                }
                if (valor === "1") {
                    this.contadorTotal++;
                    this.contadorSeleccion++;
                    this.contadorCeros = 0;
                }
                if(componente[0].valor1 == "0" && componente[1].valor1 == "0" && componente[2].valor1 == "0" && this.edadCumplida >= this.edadCumplidaFija){
                    this.reiniciarValoracion();
                    return this.$toast.error('Recuerde realizar la valoración en orden ascendente');
                }
                if(componente[0].valor1 != null && componente[1].valor1 != null && componente[2].valor1 != null && this
                    .edadCumplida != 12 && this.edadCumplida >= this.edadCumplidaFija  ) {
                    this.edadCumplida++;
                }
                if(componente[0].valor1 == null && componente[1].valor1 == "0" && componente[2].valor1 == "0" && this.edadCumplida >= this.edadCumplidaFija){
                    componente[0].valor1 == null;
                    componente[1].valor1 == null;
                    componente[2].valor1 == null;
                    this.reiniciarValoracion();
                    return this.$toast.error('Recuerde realizar la valoración en orden ascendente');
                }if(componente[0].valor1 == null && componente[1].valor1 == "0" && componente[2].valor1 == null && this.edadCumplida >= this.edadCumplidaFija){
                    componente[0].valor1 == null;
                    componente[1].valor1 == null;
                    componente[2].valor1 == null;
                    this.reiniciarValoracion();
                    return this.$toast.error('Recuerde realizar la valoración en orden ascendente');
                }
                if(componente[0].valor1 == null && componente[1].valor1 == null && componente[2].valor1 == "0" && this.edadCumplida >= this.edadCumplidaFija){
                    componente[0].valor1 == null;
                    componente[1].valor1 == null;
                    componente[2].valor1 == null;
                    this.reiniciarValoracion();
                    return this.$toast.error('Recuerde realizar la valoración en orden ascendente');
                }
                if (componente[0].valor1 != null && componente[1].valor1 != null && componente[2].valor1 != null && this
                    .edadCumplida != 1 && this.edadCumplida < this.edadCumplidaFija) {
                    this.edadCumplida--;
                }
                if (this.contadorSeleccion === 2 && this.edadCumplidaFija === this.edadCumplida) {
                    this.punto_inicio_audicion_lenguaje = item;
                    this.desactivarBotonRango = true;
                    this.contadorSeleccion = 0;

                }
                if (componente[0].valor1 === "1" && this.edadCumplidaFija === this.edadCumplida && componente[1]
                    .valor1 === "0" && componente[2].valor1 === null && this.edadCumplida != 1) {
                    this.edadCumplida--;
                    this.contadorSeleccion = 1;
                    this.contadorTotal = 0;
                }
                if (this.contadorSeleccion === 2 && this.punto_inicio_audicion_lenguaje === null) {
                    this.punto_inicio_audicion_lenguaje = item;
                    this.desactivarBotonRango = true;
                    this.edadCumplida = this.edadCumplidaFija;
                    this.contadorCeros++;
                    this.contadorSeleccion = 0;
                }
                if (valor === "0") {
                    this.contadorCeros++;
                    this.contadorSeleccion = 0;
                    this.contadorTotal++;
                    if (componente[0].valor1 === "1") {
                        this.contadorSeleccion = 1;
                    }
                }
                if (this.contadorCeros >= 2 && this.edadCumplida >= this.edadCumplidaFija) {
                    this.desactivarBotones = true;
                    this.desactivarBotonRango = false;
                    this.$emit('confirmar');
                }
            },
            reiniciarValoracion() {
                this.puntuacionTotal = 0;
                this.contadorCeros = 0;
                this.contadorSeleccion = 0;
                this.contadorTotal = 0;
                this.punto_inicio_audicion_lenguaje = null;
                this.desactivarBotonRango = false;
                this.desactivarBotones = false;
                this.edadCumplida = this.edadCumplidaFija;
                this.resultadoAudicionLenguaje = null;
                this.alertaResultado = null;
                this.escala.lenguaje.forEach((s) => {
                    s.componentes.forEach((s2) => {
                        s2.valor1 = null;
                    });
                });
            },
            validarErrores() {
            return this.$refs.AudicionLenguaje.validate();
            },
        },
    };

</script>
