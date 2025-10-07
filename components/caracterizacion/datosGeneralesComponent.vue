<template>
	<v-container>
		<v-card outlined elevation="2" class="pa-10">
			<v-card-title class="headline">2. CARACTERIZACIÓN DE LA FAMILIA</v-card-title>
			<v-divider></v-divider>
			<v-form ref="form" @submit.prevent="guardarDatos">
                <v-row>
                    <v-col cols="12">
                        <br>
						<v-alert text dense border="left" type="info" :icon="false" class="text-center">
							<b>2.1. Estructura y contexto familiar.</b>
						</v-alert>
					</v-col>
                </v-row>
				<v-row>
					<v-col cols="12" md="4">
						<v-card-subtitle>
							21 Tipo de familia.
						</v-card-subtitle>
						<v-autocomplete dense outlined label="Seleccione una opción:" :items="tipoFamiliaItems"
							v-model="form.tipoFamilia" :rules="[rules.obligatorio]"></v-autocomplete>
					</v-col>
					<v-col cols="12" md="4">
						<v-card-subtitle>
							22. N° de personas que conforman la familia.
						</v-card-subtitle>
						<v-text-field dense outlined type="number" label="Escribe acá..."
							v-model="form.numeroPersonasConformanFamilia"
							:rules="[rules.obligatorio, rules.numero, rules.mayorQueCero]" />
					</v-col>
					<v-col cols="12" md="4">
						<v-card-subtitle>
							24. Funcionalidad de la familia (Apgar familiar)
						</v-card-subtitle>
						<v-autocomplete dense outlined label="Seleccione una opción:" :items="funcionalidadFamiliaItems"
							v-model="form.funcionalidadFamilia" :rules="[rules.obligatorio]"></v-autocomplete>
					</v-col>
					<v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                25. En la familia se identifica un cuidador principal de niños, niñas, persona con discapacidad, adulto mayor o enfermedad?
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="cuidador"
                                                v-model="form.cuidadorNinos"
                                                v-for="(cuidador, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="cuidador" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
					</v-col>
					<v-col cols="12" md="4" v-if="form.cuidadorNinos === 'Si'">
						<v-card-subtitle>
							26. Aplicar escala ZARIT y registre aquí el resultado -puntaje para determinar si se requiere intervención individual o familiar.
						</v-card-subtitle>
						<v-autocomplete dense outlined label="Seleccione una opción:" :items="escalaZaritItems"
							v-model="form.escalaZarit" :rules="[rules.obligatorio]"></v-autocomplete>
					</v-col>
					<v-col cols="12" md="4">
						<v-card-subtitle>
							27. Interrelaciones de la familia con el contexto socio cultural (diligenciar ECOMAPA)
						</v-card-subtitle>
						<v-autocomplete dense outlined label="Seleccione una opción:" :items="ecopamaItems"
							v-model="form.ecopama" :rules="[rules.obligatorio]"></v-autocomplete>
					</v-col>
				</v-row>
                <v-row>
                    <v-col cols="12">
                        <br>
						<v-alert text dense border="left" type="info" :icon="false" class="text-center">
							<b>2.2 Situaciones o condiciones de especial protección de la familia y sus integrantes.</b>
						</v-alert>
					</v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="3">
                        <v-card outlined>
                            <v-card-subtitle>
                                28. Familia con niñas, niños y adolescentes.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="ninos"
                                                v-model="form.ninosFamilia"
                                                v-for="(ninos, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="ninos" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card outlined>
                            <v-card-subtitle>
                                29. Gestante en la familia.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="gestante"
                                                v-model="form.embarazada"
                                                v-for="(gestante, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="gestante" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card outlined>
                            <v-card-subtitle>
                                30. Familia con personas adultos mayores.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="adultos"
                                                v-model="form.adultosFamilia"
                                                v-for="(adultos, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="adultos" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card outlined>
                            <v-card-subtitle>
                                31. Familia víctima del conflicto armado.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="conflicto"
                                                v-model="form.conflictoArmado"
                                                v-for="(conflicto, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="conflicto" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card outlined>
                            <v-card-subtitle>
                                32. Familia que convive con personas con discapacidad.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="discapacitado"
                                                v-model="form.discapacidad"
                                                v-for="(discapacitado, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="discapacitado" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                33. Familia que convive con personas que presentan alguna enfermedad crónica, huérfana o en estado terminal.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="miembro"
                                                v-model="form.miembroEnfermo"
                                                v-for="(miembro, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="miembro" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="5">
                        <v-card-subtitle>
                            34. Familia que convive con persona que presenta alguna enfermedad transmitible.
                        </v-card-subtitle>
                        <v-autocomplete dense outlined label="Seleccione una opción:" :items="sufrieronDeItems"
                            v-model="form.enfermedadCronica" :rules="[rules.obligatorio]"></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                35. Familia con vivencia de sucesos vitales normativos y no normativos (Eventos significativos que inciden de manera positiva o negativa en la
                                persona y familia por ejemplo: Ingreso de niños estudiar, muerte familiar, accidente que genera discapacidad, separación pareja, entre otros).
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="violenciaItem"
                                                v-model="form.violencia"
                                                v-for="(violenciaItem, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="violenciaItem" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                36. Familia en situación de vulnerabilidad social (Consumo de SPA - Alcohol, explotación sexual, trabajo infantil, conflictos interpersonales,
                                violencia intrafamiliar, trastorno mental, entre otras).
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="vulnerabilidad"
                                                v-model="form.vulnerabilidadFamilia"
                                                v-for="(vulnerabilidad, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="vulnerabilidad" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle outlined>
                                37. Familias con prácticas de cuidado de salud críticas de varios de sus integrantes que ponen en riesgo o han afectado en la salud (Hábitos alimentarios, situaciones de abandono).
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="cuidado"
                                                v-model="form.cuidadoFamilia"
                                                v-for="(cuidado, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="cuidado" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-card outlined>
                            <v-card-subtitle>
                                38. Familia con integrantes con antecedentes de Ca, HTA, Diabetes, Asma, Enfermedad cardiaca, otra.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="antecedentes"
                                                v-model="form.antecedentesMiembro"
                                                v-for="(antecedentes, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="antecedentes" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                        <br>
                                    </v-col>
                                </v-row>
                                <v-text-field
                                    class="mt-4"
                                    v-model="form.cualesAntecedentesMiembro"
                                    label="38.2. ¿Cuales?" outlined dense
                                    v-show="form.antecedentesMiembro?.includes('Si')">
                                </v-text-field>
                                <v-text-field
                                    class="mt-4"
                                    v-model="form.ttoAntecedentesMiembro"
                                    label="38.3. Recibe tratamiento?" outlined dense
                                    v-show="form.antecedentesMiembro?.includes('Si')">
                                </v-text-field>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-card-subtitle>
                            39. Cómo obtiene sus alimentos.
                        </v-card-subtitle>
                        <v-autocomplete dense outlined label="Seleccione una opción:" :items="alimentosItems"
                            v-model="form.obtieneAlimentos" :rules="[rules.obligatorio]"></v-autocomplete>
                        <v-text-field
                            v-model="form.otroObtieneAlimentos"
                            label="39.2. ¿Cuál?" outlined dense
                            v-show="form.obtieneAlimentos?.includes('Otro')">
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <br>
						<v-alert text dense border="left" type="info" :icon="false" class="text-center">
							<b>2.3 Prácticas o condiciones protectoras para el cuidado de la salud predominantes en la familia.</b>
						</v-alert>
					</v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                40. Hábitos de vida saludable adaptado a las condiciones
                                contextuales y culturales de la familia y sus integrantes.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="habito"
                                                v-model="form.habitos"
                                                v-for="(habito, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="habito" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                41. Recursos socioemocionales que potencian el cuidado de la salud de la familia.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="recurso"
                                                v-model="form.recursos"
                                                v-for="(recurso, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="recurso" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                42. Prácticas para el cuidado y protección de los entornos.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="cuidadoE"
                                                v-model="form.cuidadoEntorno"
                                                v-for="(cuidadoE, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="cuidadoE" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                43. Prácticas que favorecen el establecimiento de relaciones sanas y constructivas.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="practica"
                                                v-model="form.practicasSanas"
                                                v-for="(practica, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="practica" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                44. Recursos sociales y comunitarios para el establecimiento de redes colectivas para la promoción de la salud.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="recursoS"
                                                v-model="form.recursoSocial"
                                                v-for="(recursoS, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="recursoS" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                45. Prácticas para la conservación de la autonomía y la capacidad funcional de las personas mayores.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="autonomia"
                                                v-model="form.autonomiaAdultos"
                                                v-for="(autonomia, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="autonomia" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                46. Prácticas para la prevención de enfermedades en todas las edades.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="prevencion"
                                                v-model="form.prevencionEnfermedades"
                                                v-for="(prevencion, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="prevencion" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                47. Prácticas de cuidado desde los saberes ancestrales/tradicionales (aplica para poblaciones y comunidades indígenas, negras afrocolombianas, raizales, palenqueras y rom).
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="ancestral"
                                                v-model="form.cuidadoAncestral"
                                                v-for="(ancestral, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="ancestral" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                48. Capacidades de las familias para el ejercicio y exigibilidad del derecho a la salud.
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="capacidad"
                                                v-model="form.capacidadFamilia"
                                                v-for="(capacidad, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="capacidad" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
				<v-divider class="my-4"></v-divider>
				<v-row>
                    <v-col cols="6" class="d-flex justify-start">
						<v-btn color="primary" dark dense @click="volver">Volver <v-icon right>mdi-arrow-left
							</v-icon>
						</v-btn>
					</v-col>
					<v-col cols="6" class="d-flex justify-end">
						<v-btn color="success" dark dense @click="guardar">Guardar y Continuar <v-icon right>
								mdi-content-save</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</v-card>
	</v-container>
</template>

<script>
	import {
		mapActions,
		mapState,
		mapMutations
	} from "vuex";

	export default {
		data() {
			return {
				form: {
                    tipoFamilia: '',
                    numeroPersonasConformanFamilia: '',
                    funcionalidadFamilia: '',
                    cuidadorNinos: '',
                    escalaZarit: '',
                    ecopama: '',
                    ninosFamilia: '',
                    embarazada: '',
                    adultosFamilia: '',
                    conflictoArmado: '',
                    discapacidad: '',
                    miembroEnfermo: '',
                    enfermedadCronica: '',
                    violencia: '',
                    vulnerabilidadFamilia: '',
                    cuidadoFamilia: '',
                    antecedentesMiembro: '',
                    cualesAntecedentesMiembro: '',
                    ttoAntecedentesMiembro: '',
                    obtieneAlimentos: '',
                    otroObtieneAlimentos: '',
                    habitos: '',
                    recursos: '',
                    cuidadoEntorno: '',
                    practicasSanas: '',
                    recursoSocial: '',
                    autonomiaAdultos: '',
                    prevencionEnfermedades: '',
                    cuidadoAncestral: '',
                    capacidadFamilia: '',
				},
				rules: {
					mayorQueCero: (value) => value > 0 || "El valor debe ser mayor que 0",
					obligatorio: (v) => !!v || "Este campo es obligatorio",
					numero: (value) => !isNaN(value) || "Debe ser un número",
				},
                tipoFamiliaItems: [
                    'Nuclear biparental',
                    'Nuclear monoparental',
                    'Extenso biparental',
                    'Extenso monoparental',
                    'Compuesto biparental',
                    'Compuesto monoparental',
                    'Unipersonal',
                ],
                funcionalidadFamiliaItems: [
                    '0 a 3 puntos. Disfunción familiar',
                    '4 a 6 puntos. Funcionalidad moderada',
                    '4 a 6 puntos. Alta Funcionalidad',
                ],
                siNoItems: ['Si', 'No'],
                escalaZaritItems: [
                    'Ausencia de sobrecarga (≤ 46)',
                    'Sobrecarga ligera (47-55)',
                    'Sobrecarga intensa (≥ 56)',
                ],
                ecopamaItems: [
                    '1. Positivo',
                    '2. Tenue',
                    '3. Estresante',
                    '4. Energía Fluye',
                    '5. Intenso',
                ],
                sufrieronDeItems: [
                    '1. TB',
                    '2. Lepra',
                    '3. Escabiosos, enfermedades infecciosas de la piel u otras',
					'4. Malaria',
					'5. Dengue',
					'6. Chagas',
					'7. Hepatitis A',
					'8. Alguna enfermedad inmunoprevenible (varicela- parotiditis, otra)',
                    '9. Otras',
                    '10. Ninguna',
				],
                alimentosItems: [
                    '1. Cultiva',
                    '2. Cría de animales',
                    '3. Cacería',
                    '4. Recolección de alimentos',
                    '5. Trueque o intercambio',
                    '6. Compra',
                    '7. Asistencia del Estado',
                    '8. Ayuda humanitaria',
                    '9. Otro',
                ],
			};
		},
		created() {
            this.form.tipoFamilia = this.data.tipoFamilia;
            this.form.numeroPersonasConformanFamilia = this.data.numeroPersonasConformanFamilia;
            this.form.funcionalidadFamilia = this.data.funcionalidadFamilia;
            this.form.cuidadorNinos = this.data.cuidadorNinos;
            this.form.escalaZarit = this.data.escalaZarit;
            this.form.ecopama = this.data.ecopama;
            this.form.ninosFamilia = this.data.ninosFamilia;
            this.form.embarazada = this.data.embarazada;
            this.form.adultosFamilia = this.data.adultosFamilia;
            this.form.conflictoArmado = this.data.conflictoArmado;
            this.form.discapacidad = this.data.discapacidad;
            this.form.miembroEnfermo = this.data.miembroEnfermo;
            this.form.enfermedadCronica = this.data.enfermedadCronica;
            this.form.violencia = this.data.violencia;
            this.form.vulnerabilidadFamilia = this.data.vulnerabilidadFamilia;
            this.form.cuidadoFamilia = this.data.cuidadoFamilia;
            this.form.antecedentesMiembro = this.data.antecedentesMiembro;
            this.form.cualesAntecedentesMiembro = this.data.cualesAntecedentesMiembro;
            this.form.ttoAntecedentesMiembro = this.data.ttoAntecedentesMiembro;
            this.form.obtieneAlimentos = this.data.obtieneAlimentos;
            this.form.otroObtieneAlimentos = this.data.otroObtieneAlimentos;
            this.form.habitos = this.data.habitos;
            this.form.recursos = this.data.recursos;
            this.form.cuidadoEntorno = this.data.cuidadoEntorno;
            this.form.practicasSanas = this.data.practicasSanas;
            this.form.recursoSocial = this.data.recursoSocial;
            this.form.autonomiaAdultos = this.data.autonomiaAdultos;
            this.form.prevencionEnfermedades = this.data.prevencionEnfermedades;
            this.form.cuidadoAncestral = this.data.cuidadoAncestral;
            this.form.capacidadFamilia = this.data.capacidadFamilia;
		},

		computed: {
			...mapState("encuesta", [ "encuesta" ,"datosGenerales", "data"]),
		},

		methods: {
			...mapMutations("encuesta", ["setDatosGenerales", "setModulo", "setOtroCampos"]),
			...mapActions("encuesta", ["guardarDatos", 'enviarFormulario']),

			guardarDatosGenerales() {
                this.data.tipoFamilia = this.form.tipoFamilia;
                this.data.numeroPersonasConformanFamilia = this.form.numeroPersonasConformanFamilia;
                this.data.funcionalidadFamilia = this.form.funcionalidadFamilia;
                this.data.cuidadorNinos = this.form.cuidadorNinos;
                this.data.escalaZarit = this.form.escalaZarit;
                this.data.ecopama = this.form.ecopama;
                this.data.ninosFamilia = this.form.ninosFamilia;
                this.data.embarazada = this.form.embarazada;
                this.data.adultosFamilia = this.form.adultosFamilia;
                this.data.conflictoArmado = this.form.conflictoArmado;
                this.data.discapacidad = this.form.discapacidad;
                this.data.miembroEnfermo = this.form.miembroEnfermo;
                this.data.enfermedadCronica = this.form.enfermedadCronica;
                this.data.violencia = this.form.violencia;
                this.data.vulnerabilidadFamilia = this.form.vulnerabilidadFamilia;
                this.data.cuidadoFamilia = this.form.cuidadoFamilia;
                this.data.antecedentesMiembro = this.form.antecedentesMiembro;
                this.data.cualesAntecedentesMiembro = this.form.cualesAntecedentesMiembro;
                this.data.ttoAntecedentesMiembro = this.form.ttoAntecedentesMiembro;
                this.data.obtieneAlimentos = this.form.obtieneAlimentos;
                this.data.otroObtieneAlimentos = this.form.otroObtieneAlimentos;
                this.data.habitos = this.form.habitos;
                this.data.recursos = this.form.recursos;
                this.data.cuidadoEntorno = this.form.cuidadoEntorno;
                this.data.practicasSanas = this.form.practicasSanas;
                this.data.recursoSocial = this.form.recursoSocial;
                this.data.autonomiaAdultos = this.form.autonomiaAdultos;
                this.data.prevencionEnfermedades = this.form.prevencionEnfermedades;
                this.data.cuidadoAncestral = this.form.cuidadoAncestral;
                this.data.capacidadFamilia = this.form.capacidadFamilia;


				this.setDatosGenerales({
					...this.form
				});
			},

			scrollToTop() {
				window.scrollTo({
					top: 0,
					behavior: 'smooth'
				})
			},

			guardar() {
				if (!this.$refs.form || !this.$refs.form.validate) {
					console.error("El formulario no está disponible");
					return;
				}

				if (!this.$refs.form.validate()) {
					this.$toast.error("Por favor, completa todos los campos requeridos.");
					return;
				}

				this.guardarDatosGenerales();
				this.$emit('siguiente', this.form);
				this.$emit("completado", {
					stan: "DatosGenerales",
					completo: true
				});
				this.scrollToTop();
			},
			volver() {
				this.guardarDatosGenerales();
				this.$emit('anterior');
			},

		},
	};
</script>
