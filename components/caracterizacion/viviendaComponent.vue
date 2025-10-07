<template>
	<v-container>
		<v-card outlined elevation="2" class="pa-10">
			<v-card-title class="headline">4. CARACTERIZACIÓN DEL ENTORNO</v-card-title>
			<v-divider></v-divider>
			<v-form ref="form" @submit.prevent="guardarDatos">
                <v-row>
                    <v-col cols="12">
                        <br>
						<v-alert text dense border="left" type="info" :icon="false" class="text-center">
							<b>4.1. Características y condiciones del entorno y de la vivienda.</b>
						</v-alert>
					</v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-card-subtitle>
                            82. Tipo de vivienda
                        </v-card-subtitle>
                        <v-autocomplete dense outlined label="selecione una opción:" :items="viviendaTipoItems"
                            v-model="form.tipoVivienda" :rules="[rules.obligatorio]"></v-autocomplete>
                        <v-text-field dense outlined label="82.2 ¿Cuál?" v-show="form.tipoVivienda === 'Otro'"
							v-model="form.otroTipoVivienda"
							:rules="[rules.visibleObligatorioOtro(form.otroTipoVivienda, form.tipoVivienda)]" />
                    </v-col>

					<v-col cols="12" md="4">
						<v-card-subtitle>
							83. ¿Cuál es el material predominante de las paredes?
						</v-card-subtitle>
						<v-autocomplete dense outlined label="selecione una opción:" :items="paredesItems"
							v-model="form.paredVivienda" :rules="[rules.obligatorio]">
						</v-autocomplete>
						<v-text-field dense outlined label="83.2 ¿Cuál?" v-show="form.paredVivienda?.includes('Otro')"
							v-model="form.otroParedVivienda"
							:rules="[rules.visibleObligatorioOtro(form.otroParedVivienda, form.paredVivienda)]" />
					</v-col>

                    <v-col cols="12" md="4">
						<v-card-subtitle>
							84. ¿Cuál es el material predominante del piso de la vivienda?
						</v-card-subtitle>
						<v-autocomplete dense outlined label="selecione una opción:" :items="pisoItems"
							v-model="form.pisoVivienda" :rules="[rules.obligatorio]"></v-autocomplete>
                        <v-text-field dense outlined label="84.2 ¿Cuál?" v-show="form.pisoVivienda?.includes('Otro')"
							v-model="form.otroPisoVivienda"
							:rules="[rules.visibleObligatorioOtro(form.otroPisoVivienda, form.pisoVivienda)]" />
					</v-col>

					<v-col cols="12" md="4">
						<v-card-subtitle>
							85. ¿Cuál es el material predominante del techo?
						</v-card-subtitle>
						<v-autocomplete dense outlined label="selecione una opción:" :items="techoItems"
							v-model="form.techoVivienda" :rules="[rules.obligatorio]">
						</v-autocomplete>
						<v-text-field dense outlined label="85.2 ¿Cuál?" v-show="form.techoVivienda?.includes('Otro')"
							v-model="form.otroTechoVivienda"
							:rules="[rules.visibleObligatorioOtro(form.otroTechoVivienda, form.techoVivienda)]" />
					</v-col>
                    <v-col cols="12" md="4">
						<v-card-subtitle>
							86. ¿De cuántos cuartos o piezas dormitorio dispone esta vivienda?
						</v-card-subtitle>
						<v-text-field dense outlined type="number"
							:rules="[rules.obligatorio, rules.numero, rules.mayorQueCero]"
							label="Escribe acá..." v-model="form.numeroCuartos" />
					</v-col>
                    <v-col cols="12" md="4">
                        <v-card outlined>
                            <v-card-subtitle>
                                87. Hacinamiento
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="item"
                                                v-model="form.hacinamiento"
                                                v-for="(item, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="item" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" >
                        <v-card outlined>
                            <v-card-title class="subtitle-1">
                                <strong>
                                    88. Se identifican algunos de los siguientes escenarios de riesgo de accidente en la vivienda.
                                </strong>
                            </v-card-title>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-15"
                                                :label="riesgo"
                                                multiple
                                                v-model="form.riesgosVivienda"
                                                v-for="(riesgo, index) in riesgosItems"
                                                :value="riesgo" :key="index"
                                                :rules="[rules.obligatorio]">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card outlined>
                            <v-card-title class="subtitle-1"><strong>
                                    89. Desde la vivienda se puede acceder fácilmente a:</strong>
                            </v-card-title>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox class="ml-8 mb-4"
                                            :label="entorno" v-model="form.entornos"
                                                v-for="(entorno, index) in entornosItems" :value="entorno" :key="index"
                                                multiple
                                                :rules="[rules.obligatorio]">
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
                                90. ¿Cuál fuente de energía o combustible que se usa para cocinar?
                            </v-card-subtitle>
                            <v-card-text>
                                <v-autocomplete dense outlined label="selecione una opción:" :items="combustibleItems"
                                    v-model="form.combustible" :rules="[rules.obligatorio]"></v-autocomplete>
                                <v-text-field dense outlined label="90.2 ¿Cuál?" v-show="form.combustible?.includes('Otro')"
                                    v-model="form.otroCombustible"
                                    :rules="[rules.visibleObligatorioOtro(form.otroCombustible, form.combustible)]" />
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-card outlined>
                            <v-card-subtitle>
                                91. ¿Se observa cerca de la vivienda o dentro de ellas criaderos o reservorios que
                                pueden favorecer la presencia de vectores transmisores de enfermedades?
                            </v-card-subtitle>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-col cols="auto">
                                        <v-row>
                                            <v-checkbox
                                                class="ml-10"
                                                :label="item"
                                                v-model="form.criaderos"
                                                v-for="(item, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="item" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                    <v-text-field dense outlined label="91.2 Cuál(es)?" v-if="form.criaderos === 'Si'"
                                    v-model="form.cualesCriaderos"
                                    :rules="[rules.visibleObligatorioSi(form.cualesCriaderos, form.criaderos)]"
                                    />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <br>
						<v-alert text dense border="left" type="info" :icon="false" class="text-center">
							<b>4.2 Oficios u ocupaciones que se desarrollan en la vivienda o su entorno inmediato (pero domicilio).</b>
						</v-alert>
					</v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-card outlined>
                            <v-card-title class="subtitle-1"><strong>
                                    92. Observe si cerca de la vivienda hay alguno de los siguientes</strong>
                            </v-card-title>
                            <v-row>
                                <v-card-text>
                                    <v-row class="d-flex flex-wrap">
                                        <v-col cols="auto">
                                            <v-row>
                                                <v-checkbox
                                                    class="ml-8"
                                                    :label="viviendaCondicion"
                                                    v-model="form.viviendaCondiciones"
                                                    v-for="(viviendaCondicion, index) in viviendaCondicionesItems"
                                                    :value="viviendaCondicion" :key="index"
                                                    multiple
                                                    :rules="[rules.obligatorio]">
                                                </v-checkbox>
                                            </v-row>
                                            <v-col cols="4">
                                                <v-text-field
                                                    class="mt-4"
                                                    v-model="form.otroViviendaCondiciones"
                                                    label="92.2 Especifique" outlined dense
                                                    v-show="form.viviendaCondiciones?.includes('Otro')"
                                                    :rules="[rules.visibleObligatorioBox(form.otroViviendaCondiciones, form.viviendaCondiciones, viviendaCondicionesItems)]">
                                                </v-text-field>
                                            </v-col>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-row>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card outlined>
                            <v-card-text>
                                <v-row class="d-flex flex-wrap">
                                    <v-card-subtitle>
                                        93. ¿Al interior de la vivienda se realiza alguna actividad económica?
                                    </v-card-subtitle>
                                    <v-col cols="auto">
                                        <v-row class="ml-15">
                                            <v-checkbox
                                                class="ml-15"
                                                :label="item"
                                                v-model="form.trabajoEnVivienda"
                                                v-for="(item, index) in siNoItems"
                                                :rules="[rules.obligatorio]"
                                                :value="item" :key="index">
                                            </v-checkbox>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
					<v-col cols="12">
                        <v-card outlined>
                            <v-col cols="12">
                                <v-card-title class="subtitle-1">
                                    <strong>94.</strong> Señale los animales que conviven con la familia dentro de la vivienda o en su entorno inmediato. <strong>(Responda solamente si tiene mascotas).</strong>
                                </v-card-title>
                                <v-card-text>
                                    <v-row class="d-flex flex-wrap">
                                        <v-col cols="2" v-for="(mascota, index) in mascotasItems" :key="index">
                                            <v-checkbox :label="mascota" v-model="form.seleccionMascotas[mascota]"
                                            @change="manejarCambioMascota(mascota)">
                                            </v-checkbox>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-col>
                            <v-col cols="12"  v-if="mostrarPreguntasMascotas">
                                <v-row>
                                    <template v-for="(mascota, key) in getMascotasSeleccionadas()">
                                        <v-col :key="'title-' + key" cols="12">
                                            <v-divider class="my-4" ></v-divider >
                                            <v-card-subtitle><strong>{{ mascota }}</strong></v-card-subtitle>
                                            <v-container>
                                                <v-text-field
                                                    class="mt-4"
                                                    v-model="form.otroMascota"
                                                    label="Escriba que otra mascota.." outlined dense
                                                    v-if="mascota === 'Otro'"
                                                    :rules="[rules.visibleObligatorio]">
                                                </v-text-field>
                                            </v-container>
                                        </v-col>
                                        <v-col :key="'cantidad-' + key" cols="12" md="6">
                                            <v-container>
                                                <v-card-subtitle>¿Cuántos {{ mascota }}?</v-card-subtitle>
                                                <v-text-field dense outlined label="Especifique" type="number"
                                                v-model="mascotasForm(mascota).cuantos" />
                                            </v-container>
                                        </v-col>

                                        <v-col :key="'vacunados-' + key" cols="12" md="6">
                                            <v-container>
                                                <v-card-subtitle>¿Están vacunados?</v-card-subtitle>
                                                <v-autocomplete dense outlined label="Seleccione una opción" :items="siNoItems"
                                                    v-model="mascotasForm(mascota).vacunados" />
                                            </v-container>
                                        </v-col>
                                    </template>
                                </v-row>
                            </v-col>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <br>
						<v-alert text dense border="left" type="info" :icon="false" class="text-center">
							<b>4.3 Agua y saneamiento básico.</b>
						</v-alert>
					</v-col>
                </v-row>
                    <v-card outlined>
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="3">
                                    <v-card-subtitle>
                                        95. ¿Cuál es la principal fuente de abastecimiento de agua para consumo humano en la vivienda?.
                                    </v-card-subtitle>
                                    <v-autocomplete dense outlined label="seleccione una opción:" :items="consumenAguaItems"
                                        v-model="form.agua" :rules="[rules.obligatorio]">
                                    </v-autocomplete>
                                    <v-text-field dense outlined label="95.2 Cuál" v-show="form.agua?.includes('Otro')"
                                        v-model="form.otroAgua" :rules="[rules.visibleObligatorioOtro(form.otroAgua, form.agua)]" />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-card-subtitle>
                                        96. ¿Cuál es el sistema de disposición de excretas en la vivienda?
                                    </v-card-subtitle>
                                    <v-autocomplete dense outlined label="selecione una opción:" :items="excretasItems"
                                        v-model="form.disponenExcretas" :rules="[rules.obligatorio]">
                                    </v-autocomplete>
                                    <v-text-field dense outlined label="96.2 Cuál?"
                                        v-show="form.disponenExcretas?.includes('Otro')" v-model="form.otroDisponenExcretas"
                                        :rules="[rules.visibleObligatorioOtro(form.otroDisponenExcretas, form.disponenExcretas)]" />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-card-subtitle>
                                        97. ¿Cuál es el sistema de disposición de aguas residuales domésticas en la vivienda?
                                    </v-card-subtitle>
                                    <v-autocomplete dense outlined label="selecione una opción:" :items="aguasResidualesItems"
                                        v-model="form.aguasResiduales" :rules="[rules.obligatorio]">
                                    </v-autocomplete>
                                    <v-text-field dense outlined label="97.2 Cuál?"
                                        v-show="form.aguasResiduales?.includes('Otro')" v-model="form.otroAguasResiduales"
                                        :rules="[rules.visibleObligatorioOtro(form.otroAguasResiduales, form.aguasResiduales)]" />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-card-subtitle>
                                        98. ¿Como se realiza la disposición final de los residuos sólidos ordinarios de la vivienda?
                                    </v-card-subtitle>
                                    <v-autocomplete dense outlined label="seleccione una opción:"
                                        :items="disposicionFinalItems" v-model="form.basuras" :rules="[rules.obligatorio]">
                                    </v-autocomplete>
                                    <v-text-field dense outlined label="98.2 Cuál?" v-show="form.basuras?.includes('Otro')"
                                        v-model="form.otroBasuras"
                                        :rules="[rules.visibleObligatorioOtro(form.otroBasuras, form.basuras)]" />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
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
	} from 'vuex';

	export default {
		data() {
			return {
				form: {
                    tipoVivienda: '',
                    otroTipoVivienda: '',
                    paredVivienda: '',
                    otroParedVivienda: '',
                    pisoVivienda: '',
                    otroPisoVivienda: '',
                    techoVivienda: '',
                    otroTechoVivienda: '',
                    numeroCuartos: '',
                    hacinamiento: '',
                    riesgosVivienda: [],
                    entornos: [],
                    combustible: '',
                    otroCombustible: '',
                    criaderos: '',
                    cualesCriaderos: '',
                    viviendaCondiciones: [],
                    otroViviendaCondiciones: '',
                    trabajoEnVivienda: '',
                    seleccionMascotas: {
					},
                    mascotas: {},
                    otroMascota: '',
                    agua: '',
                    otroAgua: '',
                    disponenExcretas: '',
                    otroDisponenExcretas: '',
                    aguasResiduales: '',
                    otroAguasResiduales: '',
                    basuras: '',
                    otroBasuras: '',


				},
				rules: {
					mayorQueCero: value => value > 0 || 'El valor debe ser mayor que 0',
					numero: value => !isNaN(value) || 'Debe ser un número',
					obligatorio: v => !!v || 'Este campo es obligatorio',

                    visibleObligatorioOtro: (condicion, visible) => {
						if (visible === 'Otro') {
							return !!condicion || 'Este campo es obligatorio';
						}
						return true;
					},

                    visibleObligatorioBox: (v, visibleArray, itemsArray) => {
						const otroSeleccionado = Array.isArray(visibleArray) &&
							visibleArray.some((item, index) => itemsArray[index] === 'Otro' && item);
						return otroSeleccionado ? (!!v || 'Este campo es obligatorio') : true;
					},

                    visibleObligatorioSi: (v, visible) => {
						if (visible === 'Si') {
							return !!v || 'Este campo es obligatorio';
						}
						return true;
					},

				},
                viviendaTipoItems: [
                    '1. Casa',
                    '2. Casa indigena',
                    '3. Carpa',
                    '4. Apartamento',
                    '5. Pieza/Cuarto en inquilinato',
                    '6. Contenedor',
                    '7. Embarcacíon',
                    '8. Vagón',
                    '9. Refugio natural',
                    '10. Cueva',
                    '11. Puente',
                    'Otro',
                ],

				paredesItems: [
                    '1. Bloque, ladrillo, piedra, madera pulida',
                    '2. Tapia pisada, adobe',
                    '3. Bahareque',
                    '4. Material prefabricado',
                    '5. Madera burda, tabla, tablón',
                    '6. Guadua, casa, esterilla, otro vegetal',
                    '7. Zinc, tela, lona, cartón, latas, desechos, plástico',
                    '8. Sin paredes',
                    'Otro',
				],

                pisoItems: [
                    '1. Alfombra o tapete, mármol, parque, madera pulida y lacada',
                    '2. Baldosa, vinilo, tableta, ladrillo',
                    '3. Cemento, gravilla',
                    '4. Madera burda, madera en mal estado, tabla, tablón',
                    '5. Tierra o arena',
                    'Otro',
				],

				techoItems: [
                    '1. Concreto',
                    '2. Tejas de barro',
                    '3. Fibrocemento',
                    '4. Zinc',
                    '5. Palma o paja,',
                    '6. Madera',
                    '7. Plastico',
                    '8. Desechos (cartón, lata, tela, sacos, etc)',
                    'Otro',
				],
                siNoItems: ['Si', 'No'],

                riesgosItems:[
                    '1. Objetos cortantes o punzantes al alcance de los niños',
                    '2. Sustancias químicas al alcance de los niños',
                    '3. Medicamentos al alcance de los niños',
                    '4. Velas, velones, inciensos encendidos en la vivienda',
                    '5. Conexiones eléctricas en mal estado o sobrecargadas',
                    '6. Botones, canicas entre otros objetos pequeños o con piezas que puedan desmontarse, al alcance de los niños',
                    '7. Pasillos obstruidos con juguetes, sillas u otros objetos',
                    '8. Superficies resbaladizas, suelos con agua, grasas, aceites, entre otros',
                    '9. Tanques o recipientes de almacenamiento de agua sin tapa',
                    '10. Escaleras sin protección'
                ],

                entornosItems: [
                    '1. Medios de transporte (Buses, autos, camiones, lanchas, etc.)',
                    '2. Parques, y áreas deportivas, Centros sociales y/o recreacionales',
                    '3. Instituciones educativas',
                    '4. Servicios de salud',
                    '5. Ninguna'
                ],

                combustibleItems: [
                    '1. Electricidad',
                    '2. Gas natural',
                    '3. Gas Líquido del petróleo (gas propano)',
                    '4. Leña, madera o carbón de leña',
                    '5. Petróleo, gasolina, kerosén, alcohol',
                    '6. Carbón mineral',
                    '7. Materiales de desecho',
                    'Otro',
                ],

                viviendaCondicionesItems:[
                    '1. Cultivos',
                    '2. Apriscos',
                    '3. Porquerizas',
                    '4. Galpones',
                    '5. Terrenos baldíos',
                    '6. Presencia de Plagas: roedores, cucarachas, zancudos, moscas, et',
                    '7. Ruido o sonidos desagradables',
                    '8. Malos olores',
                    '9. Sitios satélites de disposición de excretas',
                    '10. Rellenos sanitarios/botaderos',
                    '11. Industrias Contaminantes (del sector energético, minero, transporte, construcción, manufacturera, entre otros)',
                    '12. Contaminación visual',
                    '13. Río o quebrada',
                    '14. Planta de tratamiento de agua residual',
                    '15. Extracción mineral',
                    '16. Canales de agua lluvia',
                    '17. Vías de tráfico vehicular',
                    '18. Quemas a cielo abierto',
                    'Otro',
                ],
                mascotasItems: [
					'Perros',
                    'Gatos',
                    'Porcinos',
                    'Bóvidos: Búfalos, vacas, toros',
                    'Equinos: Asnos, mulas, caballos, burros',
                    'Ovinos / caprino',
                    'Aves de producción',
                    'Aves ornamentales',
                    'Peces ornamentales, hámster',
                    'Cobayos, conejos',
                    'Animales silvestres',
                    'Otro'
				],

                consumenAguaItems: [
                    '1. Acueducto administrado por empresa prestadora (ESP)',
                    '2. Agua embotellada o en bolsa',
                    '3. Acueducto veredal o comunitario',
                    '4. Pila pública',
                    '5. Carro tanque',
                    '6. Abasto con distribución comunitaria',
                    '7. Pozo con bomba',
                    '8. Pozo sin bomba, aljibe, jagüey o barreno',
                    '9. Laguna o jagüey',
                    '10. Río, quebrada, manantial o nacimiento',
                    '11. Aguas lluvias',
                    '12. Aguatero',
                    'Otro'
                ],

                excretasItems: [
                    '1. Sanitario conectado al alcantarillado',
                    '2. Sanitario y letrina',
                    '3. Sanitario conectado a pozo séptico',
                    '4. Sanitario ecológico seco',
                    '5. Sanitario sin conexión',
                    '6. Sanitario con disposición a fuente hídrica',
                    '7. Campo abierto',
                    'Otro'
                ],

                aguasResidualesItems:[
                    '1. Alcantarillado',
                    '2. Pozo séptico',
                    '3. Campo de oxidación',
                    '4. Biofiltro',
                    '5. Fuente hídrica',
                    '6. Campo abierto',
                    'Otro'
                ],

                disposicionFinalItems: [
                    '1. Recolección por parte del servicio de aseo distrital o municipal',
                    '2. Enterramiento',
                    '3. Quema a campo abierto',
                    '4. Disposición en fuentes de agua cercana',
                    '5. Disposición a campo abierto',
                    'Otro'
                ],


			};
		},

		created(){
			this.form.tipoVivienda = this.data.tipoVivienda;
            this.form.otroTipoVivienda = this.data.otroTipoVivienda;
            this.form.paredVivienda = this.data.paredVivienda;
            this.form.otroParedVivienda = this.data.otroParedVivienda;
            this.form.pisoVivienda = this.data.pisoVivienda;
            this.form.otroPisoVivienda = this.data.otroPisoVivienda;
            this.form.techoVivienda = this.data.techoVivienda;
            this.form.otroTechoVivienda = this.data.otroTechoVivienda;
            this.form.numeroCuartos = this.data.numeroCuartos;
            this.form.hacinamiento = this.data.hacinamiento;
            this.form.riesgosVivienda = this.data.riesgosVivienda;
            this.form.entornos = this.data.entornos;
            this.form.combustible = this.data.combustible;
            this.form.otroCombustible = this.data.otroCombustible;
            this.form.criaderos = this.data.criaderos;
            this.form.cualesCriaderos = this.data.cualesCriaderos;
            this.form.viviendaCondiciones = this.data.viviendaCondiciones;
            this.form.otroViviendaCondiciones = this.data.otroViviendaCondiciones;
            this.form.trabajoEnVivienda = this.data.trabajoEnVivienda;
            this.form.otroMascota = this.data.otroMascota;
            this.form.agua = this.data.agua;
            this.form.otroAgua = this.data.otroAgua;
            this.form.disponenExcretas = this.data.disponenExcretas;
            this.form.otroDisponenExcretas = this.data.otroDisponenExcretas;
            this.form.aguasResiduales = this.data.aguasResiduales;
            this.form.otroAguasResiduales = this.data.otroAguasResiduales;
            this.form.basuras = this.data.basuras;
            this.form.otroBasuras = this.data.otroBasuras;

            if (!this.data.mascotas || this.data.mascotas === null) {
                this.form.mascotas = {};
            } else {
                this.form.mascotas = typeof this.data.mascotas === 'string'
                    ? JSON.parse(this.data.mascotas)
                    : this.data.mascotas;
            }

            if (!this.data.seleccionMascotas || this.data.seleccionMascotas === null) {
                this.form.seleccionMascotas = {};
            } else {
                this.form.seleccionMascotas = typeof this.data.seleccionMascotas === 'string'
                    ? JSON.parse(this.data.seleccionMascotas)
                    : this.data.seleccionMascotas;
            }

            const camposArray = [
				'riesgosVivienda',
                'entornos',
                'viviendaCondiciones'
			];

            camposArray.forEach(campo => {
                if (!this.data[campo] || this.data[campo] === null) {
                    this.form[campo] = [];
                } else {
                    try {
                        // casteo de string aarray
                        this.form[campo] = JSON.parse(this.data[campo]);
                    } catch (error) {
                        // Evita errores en caso de castear no fncione
                        this.form[campo] = [];
                    }
                }
            });

		},

		computed: {
			...mapState('encuesta', ['data', 'encuesta', 'vivienda']),

            mostrarPreguntasMascotas() {
				return this.getMascotasSeleccionadas().length > 0;
			},

			mascotasForm() {
				return (mascota) => {
					if (!this.form.mascotas) {
						this.$set(this.form, 'mascotas', {});
					}
					if (!this.form.mascotas[mascota]) {
						this.$set(this.form.mascotas, mascota, { cuantos: '', vacunados: '' });
					}
					return this.form.mascotas[mascota];
				};
			},
		},

		methods: {
			...mapMutations('encuesta', ['setVivienda']),
			...mapActions('encuesta', ['guardarDatos']),

            manejarCambioMascota(mascota) {
				if (!this.form.mascotas) {
					this.$set(this.form, 'mascotas', {});
				}

				if (!this.form.mascotas[mascota]) {
					this.$set(this.form.mascotas, mascota, { cuantos: '', vacunados: '' });
				}

				this.actualizarEstadoVuex();
			},

			actualizarEstadoVuex() {
				if (!this.form.mascotas) {
					this.$set(this.form, 'mascotas', {});
				}
				this.$store.dispatch('encuesta/actualizarMascotas', this.form.mascotas);
			},

			getMascotasSeleccionadas() {
				return Object.keys(this.form.seleccionMascotas).filter(m => this.form.seleccionMascotas[m]);
			},

			guardarVivienda() {
				this.data.tipoVivienda = this.form.tipoVivienda;
                this.data.otroTipoVivienda = this.form.otroTipoVivienda;
                this.data.paredVivienda = this.form.paredVivienda;
                this.data.otroParedVivienda = this.form.otroParedVivienda;
                this.data.pisoVivienda = this.form.pisoVivienda;
                this.data.otroPisoVivienda = this.form.otroPisoVivienda;
                this.data.techoVivienda = this.form.techoVivienda;
                this.data.otroTechoVivienda = this.form.otroTechoVivienda;
                this.data.numeroCuartos = this.form.numeroCuartos;
                this.data.hacinamiento = this.form.hacinamiento;
                this.data.riesgosVivienda = this.form.riesgosVivienda;
                this.data.entornos = this.form.entornos;
                this.data.combustible = this.form.combustible;
                this.data.otroCombustible = this.form.otroCombustible;
                this.data.criaderos = this.form.criaderos;
                this.data.cualesCriaderos = this.form.cualesCriaderos;
                this.data.viviendaCondiciones = this.form.viviendaCondiciones;
                this.data.otroViviendaCondiciones = this.form.otroViviendaCondiciones;
                this.data.trabajoEnVivienda = this.form.trabajoEnVivienda;
                this.data.seleccionMascotas = this.form.seleccionMascotas;
                this.data.mascotas = this.form.mascotas;
                this.data.otroMascota = this.form.otroMascota;
                this.data.agua = this.form.agua;
                this.data.otroAgua = this.form.otroAgua;
                this.data.disponenExcretas = this.form.disponenExcretas;
                this.data.otroDisponenExcretas = this.form.otroDisponenExcretas;
                this.data.aguasResiduales = this.form.aguasResiduales;
                this.data.otroAguasResiduales = this.form.otroAguasResiduales;
                this.data.basuras = this.form.basuras;
                this.data.otroBasuras = this.form.otroBasuras;

				this.setVivienda({
					...this.form
				});

			},

			scrollToTop() {
				window.scrollTo({
					button: 0,
					behavior: 'smooth'
				});
			},

			guardar() {
				if (!this.$refs.form) {
					console.error("El formulario no está disponible");
					return;
				}

				if (!this.$refs.form.validate()) {
					this.$toast.error("Por favor, completa todos los campos requeridos.");
					return;
				}

				this.guardarVivienda();
				this.$emit('siguiente', this.form);
				this.$emit("completado", {
					stan: "Vivienda",
					completo: true
				});
				this.scrollToTop();
			},

			volver() {
				this.guardarVivienda();
				this.$emit('anterior');
			},
		},
	};

</script>
