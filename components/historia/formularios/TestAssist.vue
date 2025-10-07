<template>
    <div>
        <v-alert color="info" text dense border="left" class="text-center" icon="mdi-human-male-male-child">
            <b>TEST ASSIST</b>
        </v-alert>
        <v-row>
            <v-col cols="12" sm="12" md="12">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr v-if="numeroPregunta == 1">
                                <th class="text-center" style="width: 20%">
                                    # PREGUNTA
                                </th>
                                <th class="text-center" style="width: 41%">
                                    ITEMS
                                </th>
                                <th class="text-center" style="width: 1%">SI</th>
                                <th class="text-center" style="width: 1%">NO</th>
                            </tr>

                            <tr v-if="![1, 6, 7, 8].includes(numeroPregunta)">
                                <th class="text-center" style="width: 20%">
                                    # PREGUNTA
                                </th>
                                <th class="text-center" style="width: 41%">
                                    ITEMS
                                </th>
                                <th class="text-center" style="width: 1%"> NUNCA</th>
                                <th class="text-center" style="width: 1%">1 Ó 2 VECES</th>
                                <th class="text-center" style="width: 1%">CADA MES</th>
                                <th class="text-center" style="width: 1%">CADA SEMANA</th>
                                <th class="text-center" style="width: 1%">A DIARIO O CASI DIARIO</th>
                            </tr>

                            <tr v-if="[6, 7, 8].includes(numeroPregunta)">
                                <th class="text-center" style="width: 15%">
                                    # PREGUNTA
                                </th>
                                <th class="text-center" style="width: 41%">
                                    ITEMS
                                </th>
                                <th class="text-center" style="width: 1%"> NO, NUNCA</th>
                                <th class="text-center" style="width: 1%"> SI, EN LOS ÚLTIMOS 3 MESES</th>
                                <th class="text-center" style="width: 1%"> SÍ, PERO NO EN LOS ÚLTIMOS 3 MESES</th>
                            </tr>

                        </thead>
                        <tbody>
                            <tr v-for="valores in escala.gruesa" v-if="
                                parseInt(valores.rango) ===
                                parseInt(numeroPregunta)
                            ">
                                <td class="text-center">
                                    <h2>{{ valores.pregunta }}</h2>
                                </td>
                                <td class="text-left">
                                    <v-col v-for="componente in valores.componentes" :key="componente.item" cols="12"
                                        sm="12" md="12">
                                        {{ componente.enunciado }}
                                    </v-col>
                                </td>
                                <template v-if="numeroPregunta == 1">
                                    <td class="text-center" style="
                                            width: 5px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                        ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotonesPunto1" v-model="componente.valor1"
                                                type="radio"
                                                :name="'preguntas' + valores.rango + componente.item + 'valor1'"
                                                value="3" @change="condicionPunto1(valores.componentes)" />
                                        </v-col>
                                    </td>
                                    <td class="text-center" style="
                                            width: 5px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                        ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotonesPunto1" v-model="componente.valor1"
                                                type="radio"
                                                :name="'preguntas' + valores.rango + componente.item + 'valor1'"
                                                value="1" @change="condicionPunto1(valores.componentes)" />
                                        </v-col>
                                    </td>
                                </template>

                                <template v-if="![1, 6, 7, 8].includes(numeroPregunta)">
                                    <td class="text-center" style="
                                            width: 5px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                        ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotonesPunto2" v-model="componente.valor1"
                                                type="radio"
                                                :name="'pregunta' + valores.rango + componente.item + 'valor1'"
                                                value="0" @change="condicionPunto2(valores.componentes)" />
                                        </v-col>
                                    </td>
                                    <td class="text-center" style="
                                            width: 5px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                        ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotonesPunto2" v-model="componente.valor1"
                                                type="radio"
                                                :name="'pregunta' + valores.rango + componente.item + 'valor1'"
                                                value="2" @change="condicionPunto2(valores.componentes)" />
                                        </v-col>
                                    </td>
                                    <td class="text-center" style="
                                            width: 5px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                        ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotonesPunto2" v-model="componente.valor1"
                                                type="radio"
                                                :name="'pregunta' + valores.rango + componente.item + 'valor1'"
                                                value="3" @change="condicionPunto2(valores.componentes)" />
                                        </v-col>
                                    </td>
                                    <td class="text-center" style="
                                            width: 5px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                        ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotonesPunto2" v-model="componente.valor1"
                                                type="radio"
                                                :name="'pregunta' + valores.rango + componente.item + 'valor1'"
                                                value="4" @change="condicionPunto2(valores.componentes)" />
                                        </v-col>
                                    </td>
                                    <td class="text-center" style="
                                            width: 5px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                        ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotonesPunto2" v-model="componente.valor1"
                                                type="radio"
                                                :name="'pregunta' + valores.rango + componente.item + 'valor1'"
                                                value="6" @change="condicionPunto2(valores.componentes)" />
                                        </v-col>
                                    </td>
                                </template>

                                <template v-if="[6, 7, 8].includes(numeroPregunta)">
                                    <td class="text-center" style="
                                            width: 5px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                        ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotonesPunto6" v-model="componente.valor1"
                                                type="radio" :name="'p' + valores.rango + componente.item + 'valor1'"
                                                value="0" @change="condicionPunto6(valores.componentes)" />
                                        </v-col>
                                    </td>
                                    <td class="text-center" style="
                                            width: 5px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                        ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotonesPunto6" v-model="componente.valor1"
                                                type="radio" :name="'p' + valores.rango + componente.item + 'valor1'"
                                                value="6" @change="condicionPunto6(valores.componentes)" />
                                        </v-col>
                                    </td>
                                    <td class="text-center" style="
                                            width: 5px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                        ">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            <input :disabled="desactivarBotonesPunto6" v-model="componente.valor1"
                                                type="radio" :name="'p' + valores.rango + componente.item + 'valor1'"
                                                value="3" @change="condicionPunto6(valores.componentes)" />
                                        </v-col>
                                    </td>
                                </template>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <br><br>
        <v-container v-if="this.resultadoConteo.W == 6">
            <v-simple-table>
                <thead>
                    <tr>
                        <th class="text-center" style="width: 20%"></th>
                        <th class="text-center" style="width: 10%">Una vez a la semana o menos o Menos de 3 días
                            seguidos
                        </th>
                        <th class="text-center" style="width: 10%">Más de una vez a la semana o 3 o más días seguidos
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-center">
                            <h2>Patrón de inyección en este período</h2>
                        </td>
                        <td class="text-center" style="vertical-align: middle;">
                            <div style="display: flex; justify-content: center; align-items: center;">
                                <input :disabled="desactivarBotonesPunto8" v-model="itemPregunta8"
                                    type="radio" name="pregunta8" value="1" @change="condicionPunto8()" />
                            </div>
                        </td>
                        <td class="text-center" style="vertical-align: middle;">
                            <div style="display: flex; justify-content: center; align-items: center;">
                                <input :disabled="desactivarBotonesPunto8" v-model="itemPregunta8"
                                    type="radio" name="pregunta8" value="2" @change="condicionPunto8()" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-container>
         <v-col cols="12" sm="12" md="12">
            <v-alert color="info" text dense border="left" class="text-center" icon="mdi-information"
                v-if = "this.interpretacionItem8 != ''">
                <b>{{ this.interpretacionItem8 }}</b>
            </v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <v-alert color="success" text dense border="left" class="text-center" icon="mdi-information"
                v-if="this.finTest == true">
                <b>TEST FINALIZADO</b>
            </v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="6" offset-md="6" class="text-center">
            <v-spacer></v-spacer>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td class="text-left"><b>Interpretaciones según sustancia</b></td>
                            <td class="text-left">
                                <b>Intervención - Puntuación</b>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Tabaco</td>
                            <td class="text-left">
                                {{ interpretacionFinal.A.intervencion + " - " + interpretacionFinal.A.nivel }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Bebidas alcoholicas</td>
                            <td class="text-left">
                                {{ interpretacionFinal.B.intervencion + " - " + interpretacionFinal.B.nivel }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Cannabis</td>
                            <td class="text-left">
                                {{ interpretacionFinal.C.intervencion + " - " + interpretacionFinal.C.nivel }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Cocaína</td>
                            <td class="text-left">
                                {{ interpretacionFinal.D.intervencion + " - " + interpretacionFinal.D.nivel }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Anfetaminas</td>
                            <td class="text-left">
                                {{ interpretacionFinal.E.intervencion + " - " + interpretacionFinal.E.nivel }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Inhalantes</td>
                            <td class="text-left">
                                {{ interpretacionFinal.F.intervencion + " - " + interpretacionFinal.F.nivel }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Tranquilizantes</td>
                            <td class="text-left">
                                {{ interpretacionFinal.G.intervencion + " - " + interpretacionFinal.G.nivel }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Alucinógenos</td>
                            <td class="text-left">
                                {{ interpretacionFinal.H.intervencion + " - " + interpretacionFinal.H.nivel }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Opiáceos</td>
                            <td class="text-left">
                                {{ interpretacionFinal.I.intervencion + " - " + interpretacionFinal.I.nivel }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Otros</td>
                            <td class="text-left">
                                {{ interpretacionFinal.J.intervencion + " - " + interpretacionFinal.J.nivel }}
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-col>
    </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
    name: "TestAssist",
    props: ["datos"],
    data() {
        return {
            itemPregunta8: null,
            interpretacionItem8: '',
            finTest: false,
            avanceRealizado: false,
            avanceRealizado2: false,
            desactivarBotonesPunto1: false,
            desactivarBotonesPunto2: false,
            desactivarBotonesPunto6: false,
            desactivarBotonesPunto8: false,
            interpretacionFinal: {},
            resultadoConteo: {
                A: 0, B: 0, C: 0, D: 0, E: 0,
                F: 0, G: 0, H: 0, I: 0, J: 0, W: 0, X: 0
            },
            numeroPregunta: 1,
            consulta_id: this.datos.id,
            desactivarBotones: false,
            desactivarBotonRango: false,

            escala: {
                gruesa: [{
                    rango: "1",
                    pregunta: "1. A lo largo de su vida, ¿Cuál de las siguientes sustancias ha consumido alguna vez?",
                    componentes: [
                        {
                            item: "1",
                            enunciado: "a. Tabaco (cigarrillos, cigarros habanos, tabaco de mascar, pipa, etc.) ",
                            valor1: null,
                            valor2: "X",
                        },
                        {
                            item: "2",
                            enunciado: "b. Bebidas alcohólicas (cerveza, vino, licores, destilados, etc.)",
                            valor1: null,
                            valor2: "X",
                        },
                        {
                            item: "3",
                            enunciado: "c. Cannabis (marihuana, costo, hierba, hashish, etc.) ",
                            valor1: null,
                            valor2: "X",
                        },
                        {
                            item: "4",
                            enunciado: "d. Cocaína (coca, farlopa, crack, base, etc.) ",
                            valor1: null,
                            valor2: "X",
                        },
                        {
                            item: "5",
                            enunciado: "e. Anfetaminas u otro tipo de estimulantes (speed, éxtasis, píldoras adelgazantes, etc.)",
                            valor1: null,
                            valor2: "X",
                        },
                        {
                            item: "6",
                            enunciado: "f. Inhalantes (colas, gasolina/nafta, pegamento, etc.)",
                            valor1: null,
                            valor2: "X",
                        },
                        {
                            item: "7",
                            enunciado: "g. Tranquilizantes o pastillas para dormir (valium/diazepam,Trankimazin/Alprazolam/Xanax, Orfidal/Lorazepam, Rohipnol, etc.)",
                            valor1: null,
                            valor2: "X",
                        },
                        {
                            item: "8",
                            enunciado: "h. Alucinógenos (LSD, ácidos, ketamina, PCP, etc.) ",
                            valor1: null,
                            valor2: "X",
                        },
                        {
                            item: "9",
                            enunciado: "i. Opiáceos (heroína, metadona, codeína, morfina, dolantina/petidina, etc.) ",
                            valor1: null,
                            valor2: "X",
                        },
                        {
                            item: "10",
                            enunciado: "j. Otros ",
                            valor1: null,
                            valor2: "X",
                        },
                    ],
                },
                {
                    rango: "2",
                    pregunta: "2. ¿Con qué frecuencia ha consumido las sustancias que ha mencionado en los últimos tres meses, (PRIMERA DROGA, SEGUNDA DROGA, ETC)? ",
                    componentes: [
                        {
                            item: "11",
                            enunciado: "a. Tabaco (cigarrillos, cigarros habanos, tabaco de mascar, pipa, etc.) ",
                            valor1: null,
                            valor2: "A",
                        },
                        {
                            item: "12",
                            enunciado: "b. Bebidas alcohólicas (cerveza, vino, licores, destilados, etc.)",
                            valor1: null,
                            valor2: "B",
                        },
                        {
                            item: "13",
                            enunciado: "c. Cannabis (marihuana, costo, hierba, hashish, etc.) ",
                            valor1: null,
                            valor2: "C",
                        },
                        {
                            item: "14",
                            enunciado: "d. Cocaína (coca, farlopa, crack, base, etc.) ",
                            valor1: null,
                            valor2: "D",
                        },
                        {
                            item: "15",
                            enunciado: "e. Anfetaminas u otro tipo de estimulantes (speed, éxtasis, píldoras adelgazantes, etc.)",
                            valor1: null,
                            valor2: "E",
                        },
                        {
                            item: "16",
                            enunciado: "f. Inhalantes (colas, gasolina/nafta, pegamento, etc.)",
                            valor1: null,
                            valor2: "F",
                        },
                        {
                            item: "17",
                            enunciado: "g. Tranquilizantes o pastillas para dormir (valium/diazepam,Trankimazin/Alprazolam/Xanax, Orfidal/Lorazepam, Rohipnol, etc.)",
                            valor1: null,
                            valor2: "G",
                        },
                        {
                            item: "18",
                            enunciado: "h. Alucinógenos (LSD, ácidos, ketamina, PCP, etc.) ",
                            valor1: null,
                            valor2: "H",
                        },
                        {
                            item: "19",
                            enunciado: "i. Opiáceos (heroína, metadona, codeína, morfina, dolantina/petidina, etc.) ",
                            valor1: null,
                            valor2: "I",
                        },
                        {
                            item: "20",
                            enunciado: "j. Otros ",
                            valor1: null,
                            valor2: "J",
                        },
                    ],
                },
                {
                    rango: "3",
                    pregunta: "3. En los últimos tres meses, ¿con qué frecuencia ha tenido deseos fuertes o ansias de consumir (PRIMERA DROGA, SEGUNDA DROGA, ETC)? ",
                    componentes: [
                        {
                            item: "21",
                            enunciado: "a. Tabaco (cigarrillos, cigarros habanos, tabaco de mascar, pipa, etc.) ",
                            valor1: null,
                            valor2: "A",
                        },
                        {
                            item: "22",
                            enunciado: "b. Bebidas alcohólicas (cerveza, vino, licores, destilados, etc.)",
                            valor1: null,
                            valor2: "B",
                        },
                        {
                            item: "23",
                            enunciado: "c. Cannabis (marihuana, costo, hierba, hashish, etc.) ",
                            valor1: null,
                            valor2: "C",
                        },
                        {
                            item: "24",
                            enunciado: "d. Cocaína (coca, farlopa, crack, base, etc.) ",
                            valor1: null,
                            valor2: "D",
                        },
                        {
                            item: "25",
                            enunciado: "e. Anfetaminas u otro tipo de estimulantes (speed, éxtasis, píldoras adelgazantes, etc.)",
                            valor1: null,
                            valor2: "E",
                        },
                        {
                            item: "26",
                            enunciado: "f. Inhalantes (colas, gasolina/nafta, pegamento, etc.)",
                            valor1: null,
                            valor2: "F",
                        },
                        {
                            item: "27",
                            enunciado: "g. Tranquilizantes o pastillas para dormir (valium/diazepam,Trankimazin/Alprazolam/Xanax, Orfidal/Lorazepam, Rohipnol, etc.)",
                            valor1: null,
                            valor2: "G",
                        },
                        {
                            item: "28",
                            enunciado: "h. Alucinógenos (LSD, ácidos, ketamina, PCP, etc.) ",
                            valor1: null,
                            valor2: "H",
                        },
                        {
                            item: "29",
                            enunciado: "i. Opiáceos (heroína, metadona, codeína, morfina, dolantina/petidina, etc.) ",
                            valor1: null,
                            valor2: "I",
                        },
                        {
                            item: "30",
                            enunciado: "j. Otros ",
                            valor1: null,
                            valor2: "J",
                        },
                    ],
                },
                {
                    rango: "4",
                    pregunta: "4. En los últimos tres meses, ¿con qué frecuencia le ha llevado su consumo de (PRIMERA DROGA, SEGUNDA DROGA, ETC) a problemas de salud, sociales, legales o económicos? ",
                    componentes: [
                        {
                            item: "31",
                            enunciado: "a. Tabaco (cigarrillos, cigarros habanos, tabaco de mascar, pipa, etc.) ",
                            valor1: null,
                            valor2: "A",
                        },
                        {
                            item: "32",
                            enunciado: "b. Bebidas alcohólicas (cerveza, vino, licores, destilados, etc.)",
                            valor1: null,
                            valor2: "B",
                        },
                        {
                            item: "33",
                            enunciado: "c. Cannabis (marihuana, costo, hierba, hashish, etc.) ",
                            valor1: null,
                            valor2: "C",
                        },
                        {
                            item: "34",
                            enunciado: "d. Cocaína (coca, farlopa, crack, base, etc.) ",
                            valor1: null,
                            valor2: "D",
                        },
                        {
                            item: "35",
                            enunciado: "e. Anfetaminas u otro tipo de estimulantes (speed, éxtasis, píldoras adelgazantes, etc.)",
                            valor1: null,
                            valor2: "E",
                        },
                        {
                            item: "36",
                            enunciado: "f. Inhalantes (colas, gasolina/nafta, pegamento, etc.)",
                            valor1: null,
                            valor2: "F",
                        },
                        {
                            item: "37",
                            enunciado: "g. Tranquilizantes o pastillas para dormir (valium/diazepam,Trankimazin/Alprazolam/Xanax, Orfidal/Lorazepam, Rohipnol, etc.)",
                            valor1: null,
                            valor2: "G",
                        },
                        {
                            item: "38",
                            enunciado: "h. Alucinógenos (LSD, ácidos, ketamina, PCP, etc.) ",
                            valor1: null,
                            valor2: "H",
                        },
                        {
                            item: "39",
                            enunciado: "i. Opiáceos (heroína, metadona, codeína, morfina, dolantina/petidina, etc.) ",
                            valor1: null,
                            valor2: "I",
                        },
                        {
                            item: "40",
                            enunciado: "j. Otros ",
                            valor1: null,
                            valor2: "J",
                        },
                    ],
                },
                {
                    rango: "5",
                    pregunta: "5. En los últimos tres meses, ¿con qué frecuencia no pudo atender sus obligaciones por el consumo de (PRIMERA DROGA, SEGUNDA DROGA, ETC)?",
                    componentes: [
                        {
                            item: "41",
                            enunciado: "a. Tabaco (cigarrillos, cigarros habanos, tabaco de mascar, pipa, etc.) ",
                            valor1: null,
                            valor2: "Q",
                        },
                        {
                            item: "42",
                            enunciado: "b. Bebidas alcohólicas (cerveza, vino, licores, destilados, etc.)",
                            valor1: null,
                            valor2: "B",
                        },
                        {
                            item: "43",
                            enunciado: "c. Cannabis (marihuana, costo, hierba, hashish, etc.) ",
                            valor1: null,
                            valor2: "C",
                        },
                        {
                            item: "44",
                            enunciado: "d. Cocaína (coca, farlopa, crack, base, etc.) ",
                            valor1: null,
                            valor2: "D",
                        },
                        {
                            item: "45",
                            enunciado: "e. Anfetaminas u otro tipo de estimulantes (speed, éxtasis, píldoras adelgazantes, etc.)",
                            valor1: null,
                            valor2: "E",
                        },
                        {
                            item: "46",
                            enunciado: "f. Inhalantes (colas, gasolina/nafta, pegamento, etc.)",
                            valor1: null,
                            valor2: "F",
                        },
                        {
                            item: "47",
                            enunciado: "g. Tranquilizantes o pastillas para dormir (valium/diazepam,Trankimazin/Alprazolam/Xanax, Orfidal/Lorazepam, Rohipnol, etc.)",
                            valor1: null,
                            valor2: "G",
                        },
                        {
                            item: "48",
                            enunciado: "h. Alucinógenos (LSD, ácidos, ketamina, PCP, etc.) ",
                            valor1: null,
                            valor2: "H",
                        },
                        {
                            item: "49",
                            enunciado: "i. Opiáceos (heroína, metadona, codeína, morfina, dolantina/petidina, etc.) ",
                            valor1: null,
                            valor2: "I",
                        },
                        {
                            item: "50",
                            enunciado: "j. Otros ",
                            valor1: null,
                            valor2: "J",
                        },
                    ],
                },
                {
                    rango: "6",
                    pregunta: "6. Un amigo, un familiar o alguien más, ¿alguna vez ha mostrado preocupación por su consumo de (PRIMERA DROGA, SEGUNDA DROGA, ETC)? ",
                    componentes: [
                        {
                            item: "51",
                            enunciado: "a. Tabaco (cigarrillos, cigarros habanos, tabaco de mascar, pipa, etc.) ",
                            valor1: null,
                            valor2: "A",
                        },
                        {
                            item: "52",
                            enunciado: "b. Bebidas alcohólicas (cerveza, vino, licores, destilados, etc.)",
                            valor1: null,
                            valor2: "B",
                        },
                        {
                            item: "53",
                            enunciado: "c. Cannabis (marihuana, costo, hierba, hashish, etc.) ",
                            valor1: null,
                            valor2: "C",
                        },
                        {
                            item: "54",
                            enunciado: "d. Cocaína (coca, farlopa, crack, base, etc.) ",
                            valor1: null,
                            valor2: "D",
                        },
                        {
                            item: "55",
                            enunciado: "e. Anfetaminas u otro tipo de estimulantes (speed, éxtasis, píldoras adelgazantes, etc.)",
                            valor1: null,
                            valor2: "E",
                        },
                        {
                            item: "56",
                            enunciado: "f. Inhalantes (colas, gasolina/nafta, pegamento, etc.)",
                            valor1: null,
                            valor2: "F",
                        },
                        {
                            item: "57",
                            enunciado: "g. Tranquilizantes o pastillas para dormir (valium/diazepam,Trankimazin/Alprazolam/Xanax, Orfidal/Lorazepam, Rohipnol, etc.)",
                            valor1: null,
                            valor2: "G",
                        },
                        {
                            item: "58",
                            enunciado: "h. Alucinógenos (LSD, ácidos, ketamina, PCP, etc.) ",
                            valor1: null,
                            valor2: "H",
                        },
                        {
                            item: "59",
                            enunciado: "i. Opiáceos (heroína, metadona, codeína, morfina, dolantina/petidina, etc.) ",
                            valor1: null,
                            valor2: "I",
                        },
                        {
                            item: "60",
                            enunciado: "j. Otros ",
                            valor1: null,
                            valor2: "J",
                        },
                    ],
                },
                {
                    rango: "7",
                    pregunta: "7. ¿Ha intentado alguna vez controlar, reducir o dejar de consumir (PRIMERA DROGA, SEGUNDA DROGA, ETC) y no lo ha logrado?",
                    componentes: [
                        {
                            item: "61",
                            enunciado: "a. Tabaco (cigarrillos, cigarros habanos, tabaco de mascar, pipa, etc.) ",
                            valor1: null,
                            valor2: "A",
                        },
                        {
                            item: "62",
                            enunciado: "b. Bebidas alcohólicas (cerveza, vino, licores, destilados, etc.)",
                            valor1: null,
                            valor2: "B",
                        },
                        {
                            item: "63",
                            enunciado: "c. Cannabis (marihuana, costo, hierba, hashish, etc.) ",
                            valor1: null,
                            valor2: "C",
                        },
                        {
                            item: "64",
                            enunciado: "d. Cocaína (coca, farlopa, crack, base, etc.) ",
                            valor1: null,
                            valor2: "D",
                        },
                        {
                            item: "65",
                            enunciado: "e. Anfetaminas u otro tipo de estimulantes (speed, éxtasis, píldoras adelgazantes, etc.)",
                            valor1: null,
                            valor2: "E",
                        },
                        {
                            item: "66",
                            enunciado: "f. Inhalantes (colas, gasolina/nafta, pegamento, etc.)",
                            valor1: null,
                            valor2: "F",
                        },
                        {
                            item: "67",
                            enunciado: "g. Tranquilizantes o pastillas para dormir (valium/diazepam,Trankimazin/Alprazolam/Xanax, Orfidal/Lorazepam, Rohipnol, etc.)",
                            valor1: null,
                            valor2: "G",
                        },
                        {
                            item: "68",
                            enunciado: "h. Alucinógenos (LSD, ácidos, ketamina, PCP, etc.) ",
                            valor1: null,
                            valor2: "H",
                        },
                        {
                            item: "69",
                            enunciado: "i. Opiáceos (heroína, metadona, codeína, morfina, dolantina/petidina, etc.) ",
                            valor1: null,
                            valor2: "I",
                        },
                        {
                            item: "70",
                            enunciado: "j. Otros ",
                            valor1: null,
                            valor2: "J",
                        },
                    ],
                },
                {
                    rango: "8",
                    pregunta: "8. ¿Ha consumido alguna vez alguna droga por vía inyectada?",
                    componentes: [{
                        item: "71",
                        enunciado: "Respuesta",
                        valor1: null,
                        valor2: "W",
                    },
                    ],
                },

                ],
            },
        };
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        condicionPunto1(componente) {
            const suma = componente.reduce((total, item) => total + Number(item.valor1), 0);
            const todosSeleccionados = componente.every(item => item.valor1 !== null);

            if (todosSeleccionados && suma > 10) {
                if (!this.avanceRealizado) {
                    this.numeroPregunta++;
                    this.desactivarBotonesPunto1 = false;
                }
            } else if (todosSeleccionados && suma == 10) {
                this.desactivarBotonesPunto1 = true;
                this.finTest = true;
                this.avanceRealizado = false;
            }
        },
        condicionPunto2(componente) {
            const suma = componente.reduce((total, item) => total + Number(item.valor1), 0);
            const todosSeleccionados = componente.every(item => item.valor1 !== null);
            if (todosSeleccionados && suma > 0) {
                this.numeroPregunta++;
                this.desactivarBotonesPunto2 = false;
            } else if (todosSeleccionados && suma == 0) {
                this.desactivarBotonesPunto2 = true;
                this.numeroPregunta = 6;
            }
        },
        condicionPunto6(componente) {
            const todosSeleccionados = componente.every(item => item.valor1 !== null);
            if (todosSeleccionados && this.numeroPregunta >= 6 && this.numeroPregunta < 8) {
                this.numeroPregunta++;
            } else if (todosSeleccionados && this.numeroPregunta == 8) {
                this.$nextTick(() => {
                    if (this.resultadoConteo.W !== 6) {
                        this.desactivarBotonesPunto6 = true;
                        this.finTest = true;
                    } else {
                        this.desactivarBotonesPunto6 = true;
                    }
                });
            }
        },
        condicionPunto8() {
            if (this.itemPregunta8 != null) {
                this.finTest = true;
                this.desactivarBotonesPunto8 = true;
            }if (this.itemPregunta8 == 1){
                this.interpretacionItem8 = 'Intervención Breve, incluyendo la tarjeta “riesgos asociados con inyectarse”'
            }else if(this.itemPregunta8 == 2){
                this.interpretacionItem8 = 'Requiere mayor evaluación y tratamiento más intensivo'
            }
        },
        mostrarResultado() {
            let sumaPorLetra = {
                A: 0, B: 0, C: 0, D: 0, E: 0,
                F: 0, G: 0, H: 0, I: 0, J: 0, W: 0, X: 0
            };

            this.escala.gruesa.forEach(pregunta => {
                pregunta.componentes.forEach(componente => {
                    const letra = componente.valor2;
                    const valor = Number(componente.valor1);

                    if (sumaPorLetra.hasOwnProperty(letra) && !isNaN(valor)) {
                        sumaPorLetra[letra] += valor;
                    }
                });
            });
            this.resultadoConteo = sumaPorLetra;
            let interpretacionPorLetra = {};

            for (let letra in sumaPorLetra) {
                const valor = sumaPorLetra[letra];
                const { nivel, intervencion } = this.interpretarPorLetra(letra, valor);

                interpretacionPorLetra[letra] = {
                    total: valor,
                    nivel,
                    intervencion
                };
                this.interpretacionFinal = interpretacionPorLetra;
            }
        },
        interpretarPorLetra(letra, valor) {
            let nivel = "Valor inválido";

            if (letra === "B") {
                if (valor >= 0 && valor <= 10) nivel = "Bajo";
                else if (valor >= 11 && valor <= 26) nivel = "Moderado";
                else if (valor >= 27) nivel = "Alto";
            } else {
                if (valor >= 0 && valor <= 3) nivel = "Bajo";
                else if (valor >= 4 && valor <= 26) nivel = "Moderado";
                else if (valor >= 27) nivel = "Alto";
            }

            let intervencion = "Valor inválido";
            if (nivel === "Bajo") intervencion = "Sin intervención";
            else if (nivel === "Moderado") intervencion = "Intervención breve";
            else if (nivel === "Alto") intervencion = "Tratamiento más intensivo";

            return {
                nivel,
                intervencion
            };
        },
        obtenerDatos() {
            const data = {
                resultadoItemA : this.resultadoConteo.A,
                resultadoItemB : this.resultadoConteo.B,
                resultadoItemC : this.resultadoConteo.C,
                resultadoItemD : this.resultadoConteo.D,
                resultadoItemE : this.resultadoConteo.E,
                resultadoItemF : this.resultadoConteo.F,
                resultadoItemG : this.resultadoConteo.G,
                resultadoItemH : this.resultadoConteo.H,
                resultadoItemI : this.resultadoConteo.I,
                resultadoItemJ : this.resultadoConteo.J,
                resultadoItemW : this.resultadoConteo.W,
                resultadoItemX : this.resultadoConteo.X,
                interpretacion_item8 : this.interpretacionItem8,
                consulta_id : this.consulta_id
            }
            return {
                datos: data
            };
        }
    },
    watch: {
        'escala.gruesa': {
            handler() {
                this.mostrarResultado();
            },
            deep: true,
            immediate: true
        }
    }
};

</script>
