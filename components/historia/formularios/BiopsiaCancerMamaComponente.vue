<template>
    <v-card flat>
        <v-alert text dense color="primary" class="text-center" icon="mdi-clipboard-pulse-outline"
            border="left"><b>CÁNCER DE MAMA</b></v-alert>
        <v-form ref="formBiopsia" lazy-validation>
            <v-row dense>
                <v-col cols="12" sm="6">
                    <v-autocomplete label="¿Laboratorio que procesa?" dense outlined :items="laboratorios"
                        v-model="cancer.laboratorio_procesa" :rules="[rules.requerido]">
                    </v-autocomplete>
                </v-col>


                <v-col cols="12" sm="6">
                    <v-text-field label="Nombre patologó" dense outlined v-model="cancer.nombre_patologo"
                        :rules="[rules.requerido]"></v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-alert text dense color="blue-grey" class="text-center"><b>REPORTE DE IHQ</b></v-alert>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field label="Fecha de ingreso" dense outlined type="date" v-model="cancer.fecha_ingreso_ihq"
                        :rules="[rules.requerido]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field label="Fecha de salida" dense outlined type="date" v-model="cancer.fecha_salida_ihq"
                        :rules="[rules.requerido]"></v-text-field>
                </v-col>

                <v-col cols="12" sm="3">
                    <v-autocomplete label="Estrógenos" dense outlined :items="opcionesEstrogenos"
                        v-model="cancer.estrogenos" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="3" v-if="cancer.estrogenos">
                    <v-autocomplete label="Porcentaje estrógenos (%)" v-model="cancer.porcentaje_estrogenos" dense
                        outlined :items="opcionesPorcentaje" :rules="[rules.requerido]">
                    </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="3">
                    <v-autocomplete label="Progestageno" dense outlined :items="opcionesEstrogenos"
                        v-model="cancer.progestagenos" :rules="[rules.requerido]"></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="3" v-if="cancer.progestagenos">
                    <v-autocomplete label="Procentaje progestageno (%)" v-model="cancer.porcentaje_progestagenos" dense
                        outlined :items="opcionesPorcentaje" :rules="[rules.requerido]">
                    </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-select label="Ki-67" dense v-model="cancer.ki_67" outlined :items="opcionesKi"
                        :rules="[rules.requerido]"></v-select>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-select label="HER-2" dense outlined :items="opcionesHer" v-model="cancer.her2"
                        :rules="[rules.requerido]"></v-select>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-select label="T" dense outlined :items="opcionesT" v-model="cancer.clasificacion_t"
                        :rules="[rules.requerido]"></v-select>
                </v-col>

                <v-col v-if="cancer.clasificacion_t" cols="12" sm="12">
                    <v-text-field label="Descripción (T)" readonly v-model="descripcionClasificacionT" dense outlined>
                    </v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-select label="N" dense outlined :items="opcionesN" v-model="cancer.clasificacion_n"
                        :rules="[rules.requerido]"></v-select>
                </v-col>

                <v-col cols="12" sm="12" v-if="cancer.clasificacion_n">
                    <v-textarea label="Descripción (N)" :value="descripcionClasificacionN" dense outlined readonly>
                    </v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-select label="M" v-model="cancer.clasificacion_m" dense outlined :items="opcionesM"
                        :rules="[rules.requerido]"></v-select>
                </v-col>

                <v-col cols="12" sm="12" v-if="cancer.clasificacion_m">
                    <v-textarea label="Descripción (M)" :value="descripcionClasificacionM" dense outlined readonly>
                    </v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea label="Subtipo Molecular" auto-grow :value="subtipoMolecularCalculado" dense
                        outlined></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea auto-grow label="Fish" dense outlined v-model="cancer.fish"
                        :rules="[rules.requerido]"></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea auto-grow label="BRCA 1 y BRCA2" dense outlined v-model="cancer.brca"
                        :rules="[rules.requerido]"></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea auto-grow label="Estadio" :value="estadioCalculado" dense outlined></v-textarea>
                </v-col>
            </v-row>
        </v-form>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="botonVisible" color="success" @click="registrarBiopsia()" :loading="loading" :disabled="loading">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

export default {
    props: {
        resultadoBiopsia: {
            type: Object,
            default: () => ({})
        },
        afiliado: {
            type: Object,
            default: null
        },
         cancerProp: {
            type: Object,
            default: () => ({})
        },
        historia: {
            type: Boolean,
            default: true
        },
        botonVisible: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            laboratorios: [
                'Lapaci',
                'Symlab',
                'Colcan',
                'IPS Hospital Alma Mater',
                'Hernan Ocazionez',
                'Citopec',
                'Fundación Hospital San Vicente de Paúl',
                'Hospital Pablo Tobón Uribe',
                'IPS Universidad de Antioquia',
            ],
            opcionesKi: [
                'Ki67 inferior al 0%',
                'Ki67 entre 0% y 2%',
                'Ki67 entre 2% y 15%',
                'Ki67 entre 15% y 30%',
                'Ki67 entre 30% y 70%',
                'Ki67 entre 70% y 80%',
                'Ki67 superior al 80%',
            ],
            opcionesHer: [
                'Her2 0=Negativo',
                'Her2 1*=Negativo',
                'Her2 2+=Ambiguo',
                'Her2 3+=Positivo',
            ],
            rules: {
                requerido: v => !!v || 'Este campo es requerido'
            },
            opcionesT: [{
                text: 'Tx',
                descripcion: 'No se puede evaluar el tumor primario'
            },
            {
                text: 'TO',
                descripcion: 'No hay evidencia de tumor primario'
            },
            {
                text: 'Tis',
                descripcion: 'carcinoma in situ (DCIS, o enfermedad de Paget del seno sin masas tumorales asociadas)'
            },
            {
                text: 'T1',
                descripcion: '(incluye T1a, T1b, y T1c): tumor de 2 cm (3/4 de pulgada) o menos de ancho.'
            },
            {
                text: 'T1a',
                descripcion: 'Sin descripción adicional'
            },
            {
                text: 'T1b',
                descripcion: 'Sin descripción adicional'
            },
            {
                text: 'T1c',
                descripcion: 'Sin descripción adicional'
            },
            {
                text: 'T2',
                descripcion: 'el tumor mide más de 2 cm, pero no más de 5 cm (2 pulgadas) de ancho.'
            },
            {
                text: 'T3',
                descripcion: 'el tumor mide más de 5 cm de ancho'
            },
            {
                text: 'T4',
                descripcion: ' (incluye T4a, T4b, T4c, y T4d): el tumor es de cualquier tamaño y crece hacia la pared torácica o la piel. Esto incluye al cáncer de seno inflamatorio.'
            },
            {
                text: 'T4a',
                descripcion: 'Sin descripción adicional'
            },
            {
                text: 'T4b',
                descripcion: 'Sin descripción adicional'
            },
            {
                text: 'T4c',
                descripcion: 'Sin descripción adicional'
            },
            {
                text: 'T4d',
                descripcion: 'Sin descripción adicional'
            },
            ],
            opcionesN: [{
                text: 'NX',
                descripcion: 'Los ganglios linfáticos adyacentes no se pueden evaluar (por ejemplo, si se extirparon anteriormente).'
            },
            {
                text: 'N0',
                descripcion: 'El cáncer no se ha propagado a los ganglios linfáticos adyacentes.'
            },
            {
                text: 'N0(i+)',
                descripcion: 'El área de propagación del cáncer contiene menos de 200 células y mide menos de 0.2 mm. La abreviación “i+” significa que un pequeño número de células cancerosas (llamadas células tumorales aisladas) fueron observadas con inmunohistoquímica.'
            },
            {
                text: 'N0(mol+)',
                descripcion: 'No se observan células cancerosas en los ganglios linfáticos axilares, pero se detectan señales de ellas mediante RT-PCR (una prueba molecular).'
            },
            {
                text: 'N1',
                descripcion: 'El cáncer se propagó a entre 1 y 3 ganglios linfáticos axilares y/o a ganglios linfáticos mamarios internos en biopsia de ganglio centinela.'
            },
            {
                text: 'N1mi',
                descripcion: 'Micrometástasis (áreas diminutas de propagación del cáncer) en ganglios linfáticos que miden al menos 0.2 mm, pero menos de 2 mm.'
            },
            {
                text: 'N1a',
                descripcion: 'Cáncer en 1 a 3 ganglios linfáticos axilares con al menos un área de propagación de más de 2 mm.'
            },
            {
                text: 'N1b',
                descripcion: 'Cáncer en ganglios linfáticos mamarios internos en el mismo lado detectado solo por biopsia de ganglio centinela.'
            },
            {
                text: 'N1c',
                descripcion: 'Presentes tanto N1a como N1b.'
            },
            {
                text: 'N2',
                descripcion: 'Cáncer en 4 a 9 ganglios linfáticos axilares, o en ganglios linfáticos mamarios internos agrandados.'
            },
            {
                text: 'N2a',
                descripcion: 'Cáncer en 4 a 9 ganglios linfáticos axilares, con áreas de propagación mayores de 2 mm.'
            },
            {
                text: 'N2b',
                descripcion: 'Cáncer en uno o más ganglios linfáticos mamarios internos agrandados.'
            },
            {
                text: 'N3',
                descripcion: 'Clasificación general que incluye los casos N3a, N3b y N3c.'
            },
            {
                text: 'N3a',
                descripcion: 'Cáncer en 10 o más ganglios linfáticos axilares o en ganglios infraclaviculares, con al menos un área mayor de 2 mm.'
            },
            {
                text: 'N3b',
                descripcion: 'Cáncer en ganglios axilares (al menos un área mayor de 2 mm) y ganglios mamarios internos agrandados o detectados en biopsia de ganglio centinela.'
            },
            {
                text: 'N3c',
                descripcion: 'Cáncer en ganglios linfáticos supraclaviculares en el mismo lado del cáncer, con al menos un área mayor de 2 mm.'
            },
            {
                text: 'N3d',
                descripcion: 'Cáncer en ganglios linfáticos supraclaviculares en el mismo lado del cáncer, con al menos un área mayor de 2 mm.'
            },
            ],
            opcionesM: [{
                text: 'MX',
                descripcion: 'Este permite reclasificar'
            },
            {
                text: 'M0',
                descripcion: 'No se encuentra propagación a distancia en estudios por imágenes o por examen médico.'
            },
            {
                text: 'cM0(i+)',
                descripcion: 'Se encuentran pequeños números de células cancerosas en sangre o médula ósea mediante pruebas especiales, o áreas diminutas (≤0.2 mm) en ganglios alejados.'
            },
            {
                text: 'M1',
                descripcion: 'El cáncer se ha propagado a órganos distantes como huesos, pulmones, cerebro o hígado. Confirmado por imágenes, examen físico o biopsia (mayor a 0.2 mm).'
            }
            ],
            loading: false,
            cancer: {
                laboratorio_procesa: null,
                nombre_patologo: null,
                fecha_ingreso_ihq: null,
                fecha_salida_ihq: null,
                clasificacion_t: null,
                clasificacion_n: null,
                clasificacion_m: null,
                estrogenos: null,
                progestagenos: null,
                porcentaje_estrogenos: null,
                porcentaje_progestagenos: null,
                her2: null,
                ki_67: null,
                descripcion_t: null,
                descripcion_n: null,
                descripcion_m: null,
                subtipo_molecular: null,
                fish: null,
                brca: null,
                estadio: null,
            },
            opcionesEstrogenos: [
                'Positivo',
                'Negativo',
            ]
        }
    },
     watch: {
        cancerProp: {
            handler(nuevo) {
                if (nuevo) {
                    this.cancer = JSON.parse(JSON.stringify(nuevo));
                }
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        opcionesPorcentaje() {
            return Array.from({
                length: 101
            }, (_, i) => i);
        },

        descripcionClasificacionT() {
            const seleccion = this.opcionesT.find(op => op.text === this.cancer.clasificacion_t);
            return seleccion ? seleccion.descripcion : '';
        },
        descripcionClasificacionN() {
            const seleccion = this.opcionesN.find(op => op.text === this.cancer.clasificacion_n);
            return seleccion ? seleccion.descripcion : '';
        },

        descripcionClasificacionM() {
            const seleccion = this.opcionesM.find(op => op.text === this.cancer.clasificacion_m);
            return seleccion ? seleccion.descripcion : '';
        },

        estadioCalculado() {
            const t = this.cancer.clasificacion_t;
            const n = this.cancer.clasificacion_n;
            const m = this.cancer.clasificacion_m;
            const her2 = this.cancer.her2;
            const estrogenos = this.cancer.estrogenos;
            const progestageno = this.cancer.progestagenos;

            const her2Negativo = ['Her2 0=Negativo', 'Her2 1*=Negativo'].includes(her2);
            const her2Positivo = her2 === 'Her2 3+=Positivo';
            const hormonalesPositivos = estrogenos === 'Positivo' && progestageno === 'Positivo';

            // Estadio 0
            if (['Tx', 'T0', 'Tis'].includes(t) && n === 'NX') {
                return '0 - En el estadio 0 no hay evidencia de que las células cancerosas u otras células anormales hayan invadido el tejido normal adyacente.';
            }

            // Estadio IA
            if (['T1', 'T1a', 'T1b', 'T1c'].includes(t) && n === 'N0') {
                return 'IA - El estadio IA, en el cual el tumor mide hasta 20 milímetros (aproximadamente el tamaño de una uva) y no hay cáncer en los ganglios linfáticos.';
            }

            // Estadio IB
            if (['T1', 'T1a', 'T1b', 'T1c'].includes(t) && ['N0(i+)', 'N0(mol+)'].includes(n)) {
                return 'IB - El estadio IB puede describir: un pequeño tumor en la mama que mide menos de 20 milímetros y se encuentran pequeñas agrupaciones de células cancerosas en los ganglios linfáticos, o la ausencia de un tumor en la mama pero también se encuentran pequeñas agrupaciones de células cancerosas en los ganglios linfáticos.';
            }

            // Estadio IIA
            if (
                ['T2', 'T3'].includes(t) &&
                ['N1', 'N1mi'].includes(n) &&
                her2Negativo &&
                hormonalesPositivos
            ) {
                return 'IIA - El estadio IIA se basa en uno de los siguientes casos: No se encuentra un tumor en la mama o hay un tumor mamario menor a 20 mm y el cáncer se ha propagado a los ganglios linfáticos axilares. También puede describir un tumor de 20 a 50 mm sin afectación ganglionar.';
            }

            // Estadio IIB
            if (
                ['T2', 'T3'].includes(t) &&
                ['N1a', 'N1b', 'N1c'].includes(n) &&
                her2Positivo &&
                hormonalesPositivos
            ) {
                return 'IIB - El estadio IIB describe tumores de 20 a 50 milímetros o mayores que ya se han propagado a los ganglios linfáticos cercanos (N1a, N1b o N1c), con receptores hormonales positivos y HER2 positivo.';
            }

            // Estadio IIIA
            if (
                ['T4', 'T4a', 'T4b', 'T4c', 'T4d'].includes(t) && n === 'N2' && her2Positivo && hormonalesPositivos
            ) {
                return 'IIIA - El estadio IIIA describe un cáncer localmente avanzado que involucra estructuras cercanas (como la piel o pared torácica) y ha alcanzado al menos 4 a 9 ganglios linfáticos, con HER2 positivo y receptores hormonales positivos.';
            }

            // Estadio IIIB
            if (
                ['T4', 'T4a', 'T4b', 'T4c', 'T4d'].includes(t) &&
                ['N2a', 'N2b'].includes(n) &&
                her2Positivo &&
                hormonalesPositivos
            ) {
                return 'IIIB - El estadio IIIB describe tumores que invaden directamente la piel o la pared torácica y se han propagado a ganglios linfáticos más allá de los axilares iniciales (N2a o N2b), con HER2 positivo y receptores hormonales positivos.';
            }

            // Estadio IIIC
            if (
                ['T4', 'T4a', 'T4b', 'T4c', 'T4d'].includes(t) &&
                ['N3a', 'N3b', 'N3c'].includes(n) &&
                hormonalesPositivos
            ) {
                return 'IIIC - En el estadio IIIC puede haber un tumor de cualquier tamaño en la mama o puede que no haya un tumor.';
            }

            // Estadio IV
            if (
                ['T4', 'T4a', 'T4b', 'T4c', 'T4d'].includes(t) &&
                ['N3a', 'N3b', 'N3c'].includes(n) &&
                m === 'M1' &&
                hormonalesPositivos
            ) {
                return 'IV - Se ha propagado a ganglios linfáticos cercanos y a partes del cuerpo distantes, más allá de la mama. Esto significa que es posible que afecte distintos órganos —como los pulmones, el hígado, o el cerebro — o los huesos.';
            }

            return 'Sin estadio definido. Por favor, revise las clasificaciones seleccionadas.';
        },

        subtipoMolecularCalculado() {
            const estrogenos = this.cancer.estrogenos;
            const progestageno = this.cancer.progestagenos;
            const her2 = this.cancer.her2;
            const ki67 = this.cancer.ki_67;

            const her2Negativo = ['Her2 0=Negativo', 'Her2 1*=Negativo'].includes(her2);
            const her2Positivo = her2 === 'Her2 3+=Positivo';

            const ki67Bajo = [
                'Ki67 inferior al 0%',
                'Ki67 entre 0% y 2%',
                'Ki67 entre 2% y 15%'
            ].includes(ki67);

            const ki67Alto = [
                'Ki67 entre 15% y 30%',
                'Ki67 entre 30% y 70%',
                'Ki67 entre 70% y 80%',
                'Ki67 superior al 80%',
            ].includes(ki67);

            // Luminal A
            if (
                estrogenos === 'Positivo' &&
                progestageno === 'Positivo' &&
                her2Negativo &&
                ki67Bajo
            ) {
                return 'Luminal A - Bajo Ki-67, HER2 negativo, y receptores hormonales positivos. Asociado a mejor pronóstico.';
            }

            // Luminal B con Ki67 elevado
            if (
                estrogenos === 'Positivo' &&
                progestageno === 'Positivo' &&
                ki67Alto
            ) {
                return 'Luminal B (Ki-67 alto) - Receptores hormonales positivos con alto índice de proliferación (Ki-67 > 15%), HER2 puede ser positivo o negativo.';
            }

            // Luminal B genérico
            if (
                estrogenos === 'Positivo' &&
                progestageno === 'Positivo' &&
                !!her2
            ) {
                return 'Luminal B - Receptores hormonales positivos, con cualquier estado HER2.';
            }

            // HER2 puro
            if (
                estrogenos === 'Negativo' &&
                progestageno === 'Negativo' &&
                her2Positivo
            ) {
                return 'HER2-enriquecido - Receptores hormonales negativos, pero HER2 positivo. Subtipo con opciones terapéuticas específicas (anticuerpos anti-HER2).';
            }

            // Triple negativo
            if (
                estrogenos === 'Negativo' &&
                progestageno === 'Negativo' &&
                her2Negativo
            ) {
                return 'Triple negativo - Receptores hormonales negativos y HER2 negativo. Subtipo con opciones terapéuticas limitadas y mayor agresividad.';
            }

            return 'Sin clasificación molecular definida. Por favor, revise las opciones seleccionadas.';
        }

    },

    mounted() {

    },

    methods: {
        async registrarBiopsia() {
            if (!this.$refs.formBiopsia.validate()) {
                return this.$toast.error('Diligencia por favor todos los campos requerido')
            };
            this.loading = true;
            let afiliado = this.historia === true ? this.afiliado.afiliado_id : this.afiliado.id;
            let consulta = this.historia === true ? this.afiliado.id : null;
            let id = this.historia === true ? this.cancer.registro_biopsias_patologia_id : null;

            const data = {
                ...this.cancer,
                ...this.resultadoBiopsia,
                descripcion_n: this.descripcionClasificacionN,
                descripcion_t: this.descripcionClasificacionT,
                descripcion_m: this.descripcionClasificacionM,
                subtipo_molecular: this.subtipoMolecularCalculado,
                afiliado_id: afiliado,
                estadio: this.estadioCalculado,
                cie10_id: this.resultadoBiopsia.cie10_id,
                fecha_inicial_biopsia: this.resultadoBiopsia?.fecha_inicio,
                fecha_final_biopsia: this.resultadoBiopsia?.fecha_final,
                consulta_id: consulta,
                id: id
            };

            try {
                await this.$axios.post('registrar-biopsias/registrar-biopsia-cancer', data);
                this.$toast.success('Biopsia de cáncer de mama registrada exitosamente.');
               if (!this.historia) {
                    this.$emit('limpiarFormulario');
                }
            } catch (error) {
                console.error(error);
                this.$toast.error('Error al registrar la biopsia de cáncer de mama.');
            } finally {
                this.loading = false
            }
        },

        limpiarInformacion() {
            this.cancer = {}
        },

    }
}

</script>
