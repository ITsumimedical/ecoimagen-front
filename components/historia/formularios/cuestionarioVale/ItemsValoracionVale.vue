<template>
    <div>
        <v-alert color="warning" text dense border="left" class="text-center" icon="mdi-information">
            <b>ITEMS DE VALORACIÓN</b>
        </v-alert>
        <br>
        <v-row>
            <v-col cols="12" sm="12" md="12">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 10%">
                                    RANGO DE EDAD
                                </th>
                                <th class="text-center" style="width: 41%">
                                    REPORTE DE PADRES
                                </th>
                                <th class="text-center" style="width: 41%">
                                    OBSERVACIÓN DIRECTA(de apoyo a la evaluación)
                                </th>
                                <th class="text-center" style="width: 1%">SI</th>
                                <th class="text-center" style="width: 1%">NO</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="valores in escala.gruesa" v-if="
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
                                        <v-btn :disabled="desactivarBotonRango" color="primary" fab x-small dark
                                            @click="aumentarRangoEdad()">
                                            <v-icon>mdi-menu-down</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                                <td class="text-left">
                                    <v-col v-for="componente in valores.componentes" :key="componente.item" cols="12"
                                        sm="12" md="12">
                                        {{ componente.enunciado }}
                                    </v-col>
                                </td>
                                <td class="text-left">
                                    <v-col v-for="observaciones in valores.observaciones" :key="observaciones.enunciado"
                                        cols="12" sm="12" md="12">
                                        {{ observaciones.enunciado }}
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
                                                :name="'gruesa' + valores.rango +componente.item + 'valor1' " value="1"
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
                                                type="radio" :name="'gruesa' + valores.rango +componente.item +'valor1'"
                                                value="0"
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
        <br>
        <template v-if="edadCumplidaRango >= 36">

            <v-alert color="warning" text dense border="left" class="text-center" icon="mdi-information">
                <b>ITEMS DE VALORACIÓN VESTIBULAR</b>
            </v-alert>
            <br>
            <v-row>
                <v-col cols="12" sm="12" md="12">
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-center" style="width: 10%">
                                        RANGO DE EDAD
                                    </th>
                                    <th class="text-center" style="width: 41%">
                                        REPORTE DE PADRES
                                    </th>
                                    <th class="text-center" style="width: 41%">
                                        OBSERVACIÓN DIRECTA(de apoyo a la evaluación)
                                    </th>
                                    <th class="text-center" style="width: 1%">SI</th>
                                    <th class="text-center" style="width: 1%">NO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="valores in valoracionVestibular.items" v-if="
                                    parseInt(valores.rango) ===
                                    parseInt(edadRangoVestibular)
                                ">
                                    <td class="text-center">
                                        <h1>{{ valores.rango }}</h1>
                                    </td>
                                    <td class="text-left">
                                        <v-col v-for="componente in valores.componentes" :key="componente.item"
                                            cols="12" sm="12" md="12">
                                            {{ componente.enunciado }}
                                        </v-col>
                                    </td>
                                    <td class="text-left">
                                        <v-col v-for="observaciones in valores.observaciones"
                                            :key="observaciones.enunciado" cols="12" sm="12" md="12">
                                            {{ observaciones.enunciado }}
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
                                                <input :disabled="desactivarBotonesVestibular"
                                                    v-model="componente.valor1" type="radio"
                                                    :name="'gruesa' + valores.rango +componente.item + 'valor1' "
                                                    value="1"
                                                    @change="condicionVestibular(componente.item,valores.componentes,'1',1)" />
                                            </v-col>
                                        </td>
                                        <td class="text-center" style="
                                            width: 5px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                        ">
                                            <v-col v-for="componente in valores.componentes" :key="componente.item"
                                                cols="12" sm="12" md="12">
                                                <input :disabled="desactivarBotonesVestibular"
                                                    v-model="componente.valor1" type="radio"
                                                    :name="'gruesa' + valores.rango +componente.item +'valor1'"
                                                    value="0"
                                                    @change="condicionVestibular(componente.item,valores.componentes,'0',0)" />
                                            </v-col>
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-col>
            </v-row>
        </template>
        <br>
        <v-col cols="12" sm="12" md="6" offset-md="6" class="text-center">
            <v-spacer></v-spacer>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td class="text-left">Respuestas negativas (C)</td>
                            <td class="text-left">
                                {{ resultadoConteo.C }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Respuestas negativas (E)</td>
                            <td class="text-left">
                                {{ resultadoConteo.E }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Respuestas negativas (I)</td>
                            <td class="text-left">
                                {{ resultadoConteo.I }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Respuestas negativas (V)</td>
                            <td class="text-left">
                                {{ resultadoConteo.V }}
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Total número de respuestas negativas</td>
                            <td class="text-left">
                                {{parseInt(resultadoConteo.C || 0) + parseInt(resultadoConteo.E || 0) + parseInt(resultadoConteo.I || 0) + parseInt(resultadoConteo.V || 0)}}
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-col>
        <!-- <br>
        <v-col xs="12" sm="12" md="12">
            <v-textarea dense outlined auto-grow label="Observaciones o comentarios: " required>
            </v-textarea>
        </v-col> -->
    </div>
</template>
<script>
    import {
        mapActions
    } from "vuex";

    export default {
        name: "ItemsValoracionVale",
        props: ["datos"],
        data() {
            return {
                totalConteoCeros: 0,
                resultadoConteo: {
                    C: 0,
                    E: 0,
                    I: 0,
                    V: 0
                },
                respuestasNegativas: 0,
                interpretacion_resultado: null,
                resultado: null,
                alertaResultado: null,
                tipo_escala: 1,
                consulta_id: this.datos.id,
                desactivarBotones: false,
                desactivarBotonesVestibular: null,
                desactivarBotonRango: true,
                contadorCeros: 0,
                contadorSeleccion: 0,
                contadorTotal: 0,
                edadCumplida: 0,
                edadCumplidaFija: 0,
                edadCumplidaRango: "",
                edadRangoVestibular: "",
                fecha_nacimiento: 0,
                escala: {
                    gruesa: [{
                            rango: "1", // De 0 a 3 meses
                            componentes: [{
                                    item: "1",
                                    enunciado: "C: Cuando en casa se cierra una puerta, se cae un objeto o se escucha un ruido muy fuerte ¿el bebé se mueve, se queda quietoo llora?",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "2",
                                    enunciado: "E: ¿Usted siente diferencias en el llanto del bebé dependiendo si es por hambre, por sueño, porque está mojado, o de mal humor?",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "3",
                                    enunciado: "E: ¿El bebé succiona con fuerza el alimento u otros objetos?",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "4",
                                    enunciado: "I: Cuando le habla al bebé, ¿él/ella la/lo mira?",
                                    valor1: null,
                                    valor2: "I",
                                },

                            ],
                            observaciones: [{
                                    enunciado: "C: El evaluador produce un ruido fuerte fuera del campo visual,pero cerca del bebé y observaque emite alguna respuestacomo: sobresalto, llorar,interrumpir actividad",
                                },
                                {
                                    enunciado: "E: El evaluador observa (si tiene oportunidad) que el bebé emite llantos diferenciados según necesidades y situaciones",
                                },
                                {
                                    enunciado: "E: El evaluador observa la succión mientras el bebé se alimenta ",
                                },
                                {
                                    enunciado: "I: El evaluador observa que el bebé mira al interlocutor cuando este le habla",
                                },
                            ],
                        },
                        {
                            rango: "2", // De 4 a 6 meses
                            componentes: [{
                                    item: "5",
                                    enunciado: "C: Cuando se escucha una puerta, timbre u otro sonido familiar ¿el bebé voltea la cabeza buscando el sonido?",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "6",
                                    enunciado: "E: Cuando alguien le dice repeticiones de gestos y vocalizaciones como vocales “aaa”, “eee” o sílabas mamama o papapa ¿el bebé intenta emitir sonidos similares? ",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "7",
                                    enunciado: "I: Cuando interactúa, juega, canta, habla con su bebé, ¿él/ella hace sonidos o sonríe?",
                                    valor1: null,
                                    valor2: "I",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "C: El evaluador aplaude fuerte fuera del campo visual pero cerca del bebé y observa que el bebé ubica la fuente sonora",
                                },
                                {
                                    enunciado: "E: El evaluador se dirige al bebé haciendo producciones como mamama, papapa, y observa que el bebé intenta imitar el sonido",
                                },
                                {
                                    enunciado: "I: El evaluador observa que en la interacción con su interlocutor el bebé emite respuestas con sonidos o sonrisas.",
                                },
                            ],
                        },
                        {
                            rango: "3", // De 7 a 9 meses
                            componentes: [{
                                    item: "8",
                                    enunciado: "C: Cuando usted le canta o le conversa ¿el bebé muestra interés? ",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "9",
                                    enunciado: "E: Cuando el bebé quiere algo, ¿utiliza sonidos, sílabas palabras o gestos para solicitarlo?",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "10",
                                    enunciado: "I: Cuando el bebé tiene alguna necesidad (por ejemplo, quiere algo, está incómodo o tiene hambre), ¿emite balbuceos, sonidos, señala o llora, para satisfacerla?",
                                    valor1: null,
                                    valor2: "I",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "C: El evaluador juega, canta, habla con el bebé y observa que el bebé reacciona, responde, ¿muestra interés?",
                                },
                                {
                                    enunciado: "E: El evaluador interactúa directamente y observa que el niño/a corresponde y hace solicitudes de cosas que quiere.",
                                },
                                {
                                    enunciado: "I: El evaluador interactúa con el bebé y detecta que él/ella emite balbuceos, hace señalamientos, sonríe, o llora para llamar la atención del interlocutor",
                                },
                            ],
                        },
                        {
                            rango: "4", // De 10 a 12 meses
                            componentes: [{
                                    item: "11",
                                    enunciado: "C: Cuando las personas le hablan, ¿el niño/a les presta atención?",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "12",
                                    enunciado: "E: Cuando le dicen palabras nuevas, ¿el niño/a trata de imitarlas?",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "13",
                                    enunciado: "E: El niño/a consume alimentos como papillas, jugos espesos, o galletas diariamente ",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "14",
                                    enunciado: "I: Cuando el niño/a quiere algún objeto (por ejemplo un juguete) ¿lo señala y/o hace sonidos para obtenerlo? ",
                                    valor1: null,
                                    valor2: "I",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "C: El evaluador le habla directamente y observa que el niño/a responde con su atención",
                                },
                                {
                                    enunciado: "E: El evaluador muestra diferentes objetos diciendo sus nombres al niño/a, y observa que él/ella intenta imitarlo.",
                                },
                                {
                                    enunciado: "E: El evaluador solicita al acudiente ofrecer al niño/a una compota, papilla u otro alimento diferente a leche y observa si el niño/a lo recibe y lo traga sin atorarse.",
                                },
                                {
                                    enunciado: "I: El evaluador toma un objeto del niño/a y observa que él/ella lo solicita señalando o emitiendo sonidos ",
                                },
                            ],
                        },
                        {
                            rango: "5", // De 13 a 15 meses
                            componentes: [{
                                    item: "15",
                                    enunciado: "C: Cuando usted le pide al niño/a que le muestre los ojos, la nariz, u otra parte del cuerpo (que él conozca) ¿lo hace? ",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "16",
                                    enunciado: "E: ¿El niño/a produce sonidos de animales o de objetos conocidos, por ejemplo gato, vaca, teléfono, etc.? ",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "17",
                                    enunciado: "I: ¿El niño/a toma y trae un objeto cuando quiere jugar con usted?",
                                    valor1: null,
                                    valor2: "I",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "C: El evaluador le pide que muestre partes del cuerpo y observa que el niño/a responde en coherencia con la solicitud ",
                                },
                                {
                                    enunciado: "E: El evaluador observa que el niño/a reproduce el sonido de diferentes animales y objetos",
                                },
                                {
                                    enunciado: "I: El evaluador tiene juguetes conocidos cerca del niño/a y observa que los toma y los trae cuando quiere jugar con alguien",
                                },
                            ],
                        },
                        {
                            rango: "6", // De 16 a 18 meses
                            componentes: [{
                                    item: "18",
                                    enunciado: "C: ¿El niño/a ejecuta acciones u órdenes sencillas cuando alguien se las solicita? Por ejemplo: “donde está la abuela”.",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "19",
                                    enunciado: "E: ¿El niño/a dice el nombre de diferentes objetos cotidianos cuando se le pregunta “Qué es esto?” ",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "20",
                                    enunciado: "I: ¿El niño/a pide cosas usando palabras, sílabas o sonidos vocálicos? ",
                                    valor1: null,
                                    valor2: "I",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "C: El evaluador observa que el niño/a señala personas conocidas a su alrededor cuando se le solicita.",
                                },
                                {
                                    enunciado: "E: El evaluador observa que el niño/a nombra diferentes objetos de uso cotidiano. ",
                                },
                                {
                                    enunciado: "I: El evaluador observa que el niño/a utiliza palabras, sílabas, sonidos vocálicos y gestos para solicitar juguetes u objetos cuando quiere jugar con ellos.",
                                },
                            ],
                        },
                        {
                            rango: "7", // De 19 a 24 meses
                            componentes: [{
                                    item: "21",
                                    enunciado: "C: ¿El niño/a entiende y ejecuta órdenes? por ejemplo si le dicen:  “Trae la cuchara de la cocina.",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "22",
                                    enunciado: "E: ¿El niño/a dice cada vez más palabras, incluyendo: “Yo, mío, no, arriba, abajo” y nombres de objetos y acciones cotidianas?",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "23",
                                    enunciado: "I: ¿El niño/a produce sonidos, sílabas y palabras, acompañadas de gestos, señalamientos, miradas y entonaciones de habla cuando quiere interactuar con otros? ",
                                    valor1: null,
                                    valor2: "I",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "C: El evaluador da al niño/a algunas órdenes directas y observa que las entiende y ejecuta. ",
                                },
                                {
                                    enunciado: "E: El evaluador observa que el niño/a utiliza nombres de objetos y acciones, y palabras como “Yo, mío, no, arriba, abajo”",
                                },
                                {
                                    enunciado: "I: El evaluador observa en la interacción del niño/a, el uso de sonidos, sílabas y palabras acompañadas de gestos, señalamientos, miradas y entonaciones de habla cuando quiere interactuar con alguien.",
                                },
                            ],
                        },
                        {
                            rango: "8", // De 25 a 36 meses
                            componentes: [{
                                    item: "24",
                                    enunciado: "C: ¿El niño/a utiliza palabras como “Mío, tuyo, suyo, etc.” cuando se le pregunta a quién pertenece algún objeto conocido, por ejemplo: “De quién es esta camisa, de quién es este muñeco?”",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "25",
                                    enunciado: "E: ¿El niño/a se mueve, se emociona, canta, aplaude, cuando le ponen música?",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "26",
                                    enunciado: "E: ¿El niño/a muerde alimentos duros (por ejemplo galletas) y los come sin atorarse? ",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "27",
                                    enunciado: "I: ¿El niño/a se muestra interesado por comunicarse, por interactuar, conversar y jugar con otros niños de su edad, en diferentes situaciones? ",
                                    valor1: null,
                                    valor2: "I",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "C: El evaluador observa que el niño/a utiliza al menos dos posesivos como “Mío, tuyo, suyo, etc.” cuando se le pregunta a quién pertenece algún objeto conocido. ",
                                },
                                {
                                    enunciado: "E: El evaluador pone música y observa que el niño/a trata de acompañarla con algún movimiento.",
                                },
                                {
                                    enunciado: "E: El evaluador le da al niño/a una galleta y observa si hace buena masticación y no se atora o tose al tragar.",
                                },
                                {
                                    enunciado: "I: En interacciones comunicativas naturales entre pares, el evaluador observa interés en el niño/a por comunicarse, interactuar, conversar, y jugar con otros niños de su edad.",
                                },
                            ],
                        },
                        {
                            rango: "9", // 3 años y 1 mes a 4 años
                            componentes: [{
                                    item: "28",
                                    enunciado: "C: En narraciones de hechos, cuentos o historias ¿el niño/a responde a preguntas de Qué, Cómo, Cuándo, etc.?",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "29",
                                    enunciado: "E: ¿El niño/a hace preguntas cuando se presenta una situación nueva para él?",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "30",
                                    enunciado: "I: ¿El niño/a expresa sus sentimientos, pensamientos, emociones, ideas cuando interactúa con personas cercanas?",
                                    valor1: null,
                                    valor2: "I",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "C: En la visualización y narración de un cuento, el evaluador observa que el niño/a responde a preguntas de Qué, Cómo, Cuándo, etc.",
                                },
                                {
                                    enunciado: "E: En la interacción comunicativa, el evaluador observa que el niño/a hace diferentes preguntas.",
                                },
                                {
                                    enunciado: "I: En la interacción comunicativa, el evaluador pide al acudiente que le pregunta al niño/a sobre sus sentimientos, pensamientos, emociones e ideas y observa el comportamiento.",
                                },
                            ],
                        },
                        {
                            rango: "10", // 4 años y 1 mes a 5 años
                            componentes: [{
                                    item: "31",
                                    enunciado: "C: ¿El niño/a sabe y repite rondas, canciones, cuentos, historias cortas o fragmentos? ",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "32",
                                    enunciado: "E: ¿El niño/a habla utilizando frases de al menos cuatro palabras para contar hechos o expresar diferentes situaciones? ",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "33",
                                    enunciado: "I: ¿El niño/a comprende y responde cuando las personas saludan, se despiden, dicen “gracias” o “por favor” ? ",
                                    valor1: null,
                                    valor2: "I",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "C: El evaluador le solicita al niño/a cantar alguna canción.",
                                },
                                {
                                    enunciado: "E: El evaluador solicita al niño/a que cuente algo que le sucedió en un contexto particular y observa el uso de frases coherentes de al menos cuatro palabras.",
                                },
                                {
                                    enunciado: "I: El evaluador identifica que el niño/a hace uso de reglas sociales, de manera guiada o espontáneamente, durante el contacto comunicativo.",
                                },
                            ],
                        },
                        {
                            rango: "11", // 5 años y 1 mes a 9 años
                            componentes: [{
                                    item: "34",
                                    enunciado: "C: El niño/a cumple con varias indicaciones que se le dan al mismo tiempo, por ejemplo cuando usted le dice: “Primero te pones de pie, luego vas corriendo hasta la puerta y después das dos golpes con la mano” o “Trae el caballito, ponlo en el corral y dale de comer” ",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "35",
                                    enunciado: "E: ¿Cuándo el niño/a habla o cuenta una historia se entiende claramente lo que dice y pronuncia bien todos los sonidos? ",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "36",
                                    enunciado: "I: ¿El niño/a sostiene conversaciones con familiares y no familiares para expresar opiniones e intentar convencer de sus ideas a los demás? ",
                                    valor1: null,
                                    valor2: "I",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "C: El evaluador observa que niño/a ejecuta varias instrucciones dadas al mismo tiempo, en la secuencia adecuada. Por ejemplo, “Trae el caballito, ponlo en el corral y dale de comer” o “Primero te pones de pie, luego vas corriendo hasta la puerta y después das dos golpes con la mano”",
                                },
                                {
                                    enunciado: "E: El evaluador solicita al niño que cuente algo que le sucedió en un contexto particular y observa que se entiende con claridad lo que dice y pronuncia bien todos los sonidos",
                                },
                                {
                                    enunciado: "I: El evaluador propone al niño/a un tema de discusión pertinente a la edad, y observa habilidades para expresar su opinión y convencer a su interlocutor",
                                },
                            ],
                        },
                        {
                            rango: "12", // 9 años y 1 mes a 12 años y 11 meses
                            componentes: [{
                                    item: "37",
                                    enunciado: "C: ¿El niño/a identifica errores, se ríe de errores e intenta corregirlos, cuando alguien los dice, por ejemplo, “la pelota tiene patas” “por la noche me como el desayuno”? ",
                                    valor1: null,
                                    valor2: "C",
                                },
                                {
                                    item: "38",
                                    enunciado: "E: ¿El niño/a habla y explica el por qué de diversas situaciones, sentimientos y pensamientos utilizando palabras abstractas como orgullo, valor, amar, etc.? ",
                                    valor1: null,
                                    valor2: "E",
                                },
                                {
                                    item: "39",
                                    enunciado: "I: ¿El niño/a conversa con otros de diferentes temas, escuchando sus ideas y expresando con argumentos su acuerdo o desacuerdo? ",
                                    valor1: null,
                                    valor2: "I",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "C: El evaluador provee al niño/a significados absurdos (frases con errores) y observa que logra identificarlos, riéndose, mirando diferente, haciendo caras o intentando corregirlo.",
                                },
                                {
                                    enunciado: "E: El evaluador observa el que niño/a justifica el porqué de diversas situaciones, pensamientos o sentimientos, por ejemplo, ¿por qué nos enojamos/enfadamos? ",
                                },
                                {
                                    enunciado: "I: El evaluador plantea al niño/a una conversación con un tema de opinión y observa que puede asumir y defender una postura personal. Por ejemplo el uso de redes sociales por parte de menores. ",
                                },
                            ],
                        },
                    ],
                },
                valoracionVestibular: {
                    items: [{
                            rango: "1", // De 3 años a 5 años
                            componentes: [{
                                    item: "1",
                                    enunciado: "V: ¿El niño/a disfruta actividades de movimientos del cuerpo como columpiarse, girar, dar botes, saltar?",
                                    valor1: null,
                                    valor2: "V",
                                },
                                {
                                    item: "2",
                                    enunciado: "V: ¿El niño/a camina recto, sin inclinarse hacia los lados y sin caerse constantemente?",
                                    valor1: null,
                                    valor2: "V",
                                },
                            ],
                            observaciones: [{
                                    enunciado: "V: El evaluador le solicita al niño/a que dé una vuelta sobre su propio eje y observa que mantiene el equilibrio",
                                },
                                {
                                    enunciado: "V: El evaluador le solicita al niño/a que camine en línea recta y observa que puede hacerlo sin inclinarse hacia los lados.",
                                },
                            ],
                        },
                        {
                            rango: "2", // 5 años y 1 mes a 12 años y 11 meses 
                            componentes: [{
                                    item: "3",
                                    enunciado: "V: ¿El niño/a disfruta dar algunas vueltas sobre sí mismo, sin caerse?",
                                    valor1: null,
                                    valor2: "V",
                                },
                                {
                                    item: "4",
                                    enunciado: "V: ¿Cuándo el niño/a se tropieza, o siente que se va a caer, pone las manos para protegerse?",
                                    valor1: null,
                                    valor2: "V",
                                },
                                {
                                    item: "5",
                                    enunciado: "V: ¿El niño/a disfruta del movimiento en varias direcciones, velocidades y alturas? por ejemplo: subir al rodadero3 , ¿sube y baja, montaña rusa, que lo suban o bajen rápidamente? ",
                                    valor1: null,
                                    valor2: "V",
                                }
                            ],
                            observaciones: [{
                                    enunciado: "V: El evaluador le pide al niño/a que dé tres vueltas sobre su propio eje, y observa que mantiene el equilibrio al detenerse.",
                                },
                                {
                                    enunciado: "V: El evaluador observa, si tiene oportunidad, que el niño/a anticipa acciones de protección para evitar caídas",
                                },
                                {
                                    enunciado: "V: El evaluador observa, si tiene oportunidad, que el niño/a disfruta hacer movimientos de con su cuerpo en diferentes velocidades, direcciones y alturas",
                                },
                            ],
                        },

                    ],
                },
            };
        },
        watch: {
            resultadoConteo: {
                handler(nuevoValor) {
                    this.$emit('respuestasNegativas', nuevoValor);
                },
                deep: true,
                immediate: false
            }
        },
        mounted() {
            this.fecha_nacimiento = this.datos.afiliado.fecha_nacimiento;
            this.$nextTick(() => {
                this.calcularEdadEnMeses(this.fecha_nacimiento);
                this.rangoEdad(this.edadCumplidaRango);
            });
        },
        methods: {
            ...mapActions("app", ["setPreload"]),

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
            totalIncorrectos(escala, valor) {
                let total = 0;
                this.escala[escala].forEach((s) => {
                    s.componentes.forEach((s2) => {
                        if (s2[valor] !== null && parseInt(s2[valor]) === 0) {
                            total++;
                        }
                    });
                });
                return total;
            },
            calcularEdadEnMeses(fechaNacimientoStr) {
                const fechaNacimiento = new Date(fechaNacimientoStr);
                const fechaActual = new Date();

                let años = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
                let meses = fechaActual.getMonth() - fechaNacimiento.getMonth();

                if (meses < 0) {
                    años--;
                    meses += 12;
                }

                const edadEnMeses = años * 12 + meses;
                return this.edadCumplidaRango = edadEnMeses;
            },

            rangoEdad(edadCumplidaRango) {
                let meses = edadCumplidaRango;

                const rangos = [{
                        min: 0,
                        max: 3,
                        valor: 1
                    },
                    {
                        min: 3,
                        max: 6,
                        valor: 2
                    },
                    {
                        min: 6,
                        max: 9,
                        valor: 3
                    },
                    {
                        min: 9,
                        max: 12,
                        valor: 4
                    },
                    {
                        min: 12,
                        max: 15,
                        valor: 5
                    },
                    {
                        min: 15,
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
                        max: 108,
                        valor: 11
                    },
                    {
                        min: 108,
                        max: 155,
                        valor: 12
                    },
                ];
                if (edadCumplidaRango >= 36 && edadCumplidaRango < 155) {
                    const rangoVestibular = [{
                            min: 36,
                            max: 60,
                            valor: 1
                        },
                        {
                            min: 60,
                            max: 155,
                            valor: 2
                        }
                    ];

                    const resultadoVestibular = rangoVestibular.find(
                        (r) => meses > r.min && meses <= r.max
                    );

                    this.edadRangoVestibular = resultadoVestibular ? resultadoVestibular.valor : 0;
                }

                const resultado = rangos.find(
                    (r) => meses > r.min && meses <= r.max
                );
                this.edadCumplidaFija = resultado ? resultado.valor : 0;

                return (this.edadCumplida = resultado ? resultado.valor : 0);
            },
            condicionValorItem(item, componente, valor, index) {
                if ((componente.length === 3 || componente.length === 4) && componente.every(item => item.valor1 ===
                        "1")) {
                    this.desactivarBotones = true;
                    this.desactivarBotonRango = false;
                    this.mostrarResultado();
                    if (this.edadCumplidaFija === this.edadCumplida) {
                        this.interpretacion_resultado = 'Según la evaluación, el resultado es considerado para la edad'
                    }
                } else {
                    this.desactivarBotones = false;
                }
                if ((componente.length === 3 || componente.length === 4) && componente.every(item => item.valor1 !==
                        null) && componente.some(item => item.valor1 === "0")) {
                    this.edadCumplida--;
                    this.interpretacion_resultado =
                        'Según las respuestas dadas, el paciente requiere una remisión a evaluación de Procesos de Habla , Lenguaje y Evaluación a Audiología Básica';
                }
            },
            condicionVestibular(item, componente, valor, index) {
                if ((componente.length === 2 || componente.length === 3) && componente.every(item => item.valor1 !=
                        null)) {
                    this.desactivarBotonesVestibular = true;
                    this.mostrarResultado();
                } else {
                    this.desactivarBotonesVestibular = false;
                }
            },
            mostrarResultado() {
                const conteo = {
                    C: 0,
                    E: 0,
                    I: 0,
                    V: 0,
                };
                this.escala.gruesa.forEach(rango => {
                    rango.componentes.forEach(componente => {
                        if (componente.valor1 === "0") {
                            conteo[componente.valor2]++;
                        }
                    });
                });
                this.resultadoConteo = conteo;

                if (this.edadCumplidaRango >= 36) {
                    this.valoracionVestibular.items.forEach(rango => {
                        rango.componentes.forEach(componente => {
                            if (componente.valor1 === "0") {
                                conteo[componente.valor2]++;
                            }
                        });
                    });
                }
            },
        }
    };

</script>
