<template>
	<v-form>
		<v-col cols="12" sm="12" md="12">
			<v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
				<b>ANTECEDENTES GINECO-OBSTETRICOS</b></v-alert>
			<v-row>
				<template v-if="datos.afiliado.edad_cumplida > 40">
					<v-col cols="12">
						<v-alert text dense color="blue-grey" class="text-center"
							icon="mdi-checkbox-marked-circle-plus-outline" border="left"><b>MENOPAUSIA</b></v-alert>
					</v-col>
					<v-col xs="12" sm="6" md="3">
						<v-select v-model="ginecologico.menopausia_presente" :items="sino"
							label="¿Menopausia presente?">
						</v-select>
					</v-col>
					<v-col cols="3" v-show="ginecologico.menopausia_presente === 'Si'">
						<v-text-field type="number" v-model="ginecologico.fecha_inicio_menopausia"
							label="Edad de inicio menopausia">
						</v-text-field>
					</v-col>
				</template>

				<v-col xs="12" sm="6" md="2">
					<v-select v-model="ginecologico.presente_menarquia" :items="sino" label="Menarquia Presente"
						v-if="ginecologico.menopausia_presente === 'No' || datos.afiliado.edad_cumplida >= 10 && datos.afiliado.edad_cumplida <= 40">
					</v-select>
				</v-col>
				<v-col xs="12" sm="6" md="1"
					v-show="(ginecologico.presente_menarquia === 'Si' && ginecologico.menopausia_presente === 'No') || (ginecologico.presente_menarquia === 'Si' && datos.afiliado.edad_cumplida < 40)">
					<v-text-field type="number" v-model="ginecologico.edad" label="Edad"></v-text-field>
				</v-col>
				<template v-if="ginecologico.presente_menarquia === 'Si'">
					<v-col cols="12" md="12" sm="12">
						<v-alert text dense color="blue-grey" class="text-center"
							icon="mdi-checkbox-marked-circle-plus-outline" border="left">
							<b>CICLOS MENSTRUALES</b>
						</v-alert>
					</v-col>
					<v-col xs="12" sm="6" md="3">
						<v-select v-model="ginecologico.clasificacion_ciclos" :items="clasificacion"
							label="Ciclos Menstruales">
						</v-select>
					</v-col>
					<v-col xs="12" sm="6" md="3">
						<v-select v-model="ginecologico.frecuencia_ciclos" :items="frecuencia"
							label="Frecuencia Ciclo Menstrual">
						</v-select>

					</v-col>
					<v-col xs="12" sm="6" md="3">
						<v-select v-model="ginecologico.duracion_ciclos" :items="duracion"
							label="Duracion Ciclo Menstrual">
						</v-select>
					</v-col>
					<v-col xs="12" sm="6" md="3">
						<v-text-field type="date" v-model="ginecologico.fecha_ultima_menstruacion" :items="sino"
							label="Fecha última menstruación" :max="hoy">
						</v-text-field>
					</v-col>
					<v-col cols="12" sm="6" md="3">
						<v-autocomplete label="¿Presenta enfermedades de ITS?"
							v-model="ginecologico.presente_transmisionsexual" dense
							:items="['Si', 'No']"></v-autocomplete>
					</v-col>
					<v-col xs="12" sm="6" md="4" v-show="ginecologico.presente_transmisionsexual === 'Si'">
						<v-textarea v-model="ginecologico.descripcion_transmision_sexual" rows="1"
							label="Descripcion ITS"
							placeholder="Recuerde especificar la fecha de contagio, el tipo de ITS y el tratamiento para la ITS"
							dense>
						</v-textarea>
					</v-col>
					<v-col xs="12" sm="6" md="3">
						<v-text-field type="number" v-model="ginecologico.edad_primera" :items="sino" dense
							label="Edad Primera relación sexual"></v-text-field>
					</v-col>
					<v-col cols="12" md="12" sm="12">
						<v-alert text dense color="blue-grey" class="text-center"
							icon="mdi-checkbox-marked-circle-plus-outline" border="left">
							<b>METODO ANTICONCEPTIVO</b>
						</v-alert>
					</v-col>
					<v-col xs="12" sm="6" md="2">
						<v-select v-model="ginecologico.presente_metodo_anticonceptivo" :items="sino"
							label="Metodo anticonceptivo Presente">
						</v-select>
					</v-col>
					<v-col xs="12" sm="6" md="3" v-show="ginecologico.presente_metodo_anticonceptivo === 'Si'">
						<v-select v-model="ginecologico.descripcion_metodo_anticonceptivo" :items="descripcionmetodo"
							label="Descripcion Metodo anticonceptivo">
						</v-select>

					</v-col>
					<v-col xs="12" sm="6" md="2"
						v-show="ginecologico.descripcion_metodo_anticonceptivo === 'Barrera' && ginecologico.presente_metodo_anticonceptivo === 'Si'">
						<v-select v-model="ginecologico.tipo_metodo_anticonceptivo"
							v-show="ginecologico.descripcion_metodo_anticonceptivo === 'Barrera' && ginecologico.presente_metodo_anticonceptivo === 'Si'"
							:items="tipometodo1" label="Tipo Metodo anticonceptivo">
						</v-select>


					</v-col>
					<v-col xs="12" sm="6" md="2"
						v-show="ginecologico.descripcion_metodo_anticonceptivo === 'Quirurgicos Reversibles' && ginecologico.presente_metodo_anticonceptivo === 'Si'">
						<v-select v-model="ginecologico.tipo_metodo_anticonceptivo" :items="tipometodo2"
							label="Tipo Metodo anticonceptivo">
						</v-select>
					</v-col>
					<v-col xs="12" sm="6" md="2"
						v-show="ginecologico.descripcion_metodo_anticonceptivo === 'Definitivos' && ginecologico.presente_metodo_anticonceptivo === 'Si'">
						<v-select v-model="ginecologico.tipo_metodo_anticonceptivo" :items="tipometodo3"
							label="Tipo Metodo anticonceptivo">
						</v-select>
					</v-col>
					<v-col xs="12" sm="6" md="3" v-show="ginecologico.presente_metodo_anticonceptivo === 'Si'">
						<v-textarea name="input-7-1" v-model="ginecologico.tratamiento_metodo_anticonceptivo" rows="1"
							label="Tratamiento Metodo anticonceptivo">
						</v-textarea>

					</v-col>
					<v-col xs="12" sm="6" md="2" v-show="ginecologico.presente_metodo_anticonceptivo === 'Si'">
						<v-text-field type="date" v-model="ginecologico.fecha_metodo_anticonceptivo" :max="hoy"
							label="Fecha Metodo anticonceptivo">
						</v-text-field>
					</v-col>
					<v-col cols="12" md="12" sm="12">
						<v-alert text dense color="blue-grey" class="text-center"
							icon="mdi-checkbox-marked-circle-plus-outline" border="left">
							<b>ANTECEDENTES DE TRATAMIENTO INFERTILIDAD</b>
						</v-alert>
					</v-col>
					<v-col xs="12" sm="6" md="4">
						<v-select v-model="ginecologico.presente_tratamiento_infertilidad" :items="sino"
							label="tratamiento infertilidad Presente">
						</v-select>

					</v-col>
					<v-col xs="12" sm="6" md="4" v-show="ginecologico.presente_tratamiento_infertilidad === 'Si'">
						<v-textarea name="input-7-1" v-model="ginecologico.tratamiento_tratamiento_infertilidad"
							rows="1" label="descripcion tratamiento infertilidad">
						</v-textarea>

					</v-col>
					<v-col v-show="ginecologico.presente_tratamiento_infertilidad === 'Si'">
						<v-text-field type="date" v-model="ginecologico.fecha_tratamiento_infertilidad"
							label="Fecha tratamiento infertilidad" :max="hoy">
						</v-text-field>
					</v-col>
				</template>
				<v-col cols="12" md="12" sm="12">
					<v-alert text dense color="blue-grey" class="text-center"
						icon="mdi-checkbox-marked-circle-plus-outline" border="left">
						<b>¿PRACTICA EL AUTOEXAMEN DE SENOS?</b>
					</v-alert>
				</v-col>
				<v-col xs="12" sm="6" md="3">
					<v-select v-model="ginecologico.presente_auto_examen_senos" :items="sino"
						label="Practica el autoexamen de senos?">
					</v-select>
				</v-col>
				<v-col xs="12" sm="6" md="3" v-show="ginecologico.presente_auto_examen_senos === 'Si'">
					<v-select v-model="ginecologico.frecuencia_auto_examen_senos" :items="frecuenciautoseno"
						label="Frecuencia autoexamen de senos">
					</v-select>
				</v-col>
				<v-col cols="12" md="12" sm="12">
					<v-alert text dense color="blue-grey" class="text-center"
						icon="mdi-checkbox-marked-circle-plus-outline" border="left">
						<b>CITOLOGÍA CERVICOUTERINA</b>
					</v-alert>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-select name="input-7-1" :items="formatearDxMamografiaGinecologia" item-text="cupConcatenado"
						item-value="id" v-model="CitologiaCervicouterina.cup_citologia"
						label="Seleccione el Tipo de Citología">
					</v-select>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-select :items="resultadosCondicionados" label="Resultados"
						v-model="CitologiaCervicouterina.resultados"></v-select>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-text-field type="date" v-model="CitologiaCervicouterina.fecha_realizacion" :max="hoy"
						label="Fecha de Realizacion">
					</v-text-field>
				</v-col>
				<v-col cols="12" sm="6" md="1">
					<v-btn class="mx-2" fab dark color="primary" @click="registrarCupCitologia()">
						<v-icon dark>
							mdi-plus
						</v-icon>
					</v-btn>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<template>
						<v-data-table :headers="headersCitologia" :items="citologias" hide-default-footer
							class="elevation-1">
							<template v-slot:[`item.user.operador`]="{ item }">
								{{ `${item.user.operador?.nombre || ''} ${item.user.operador?.apellido || ''}`.trim() ||
									'Sin nombre' }}
							</template>
							<template v-slot:[`item.created_at`]="{ item }">
								{{ item.created_at.substring(0, 10) }}
							</template>
							<template v-slot:[`item.actions`]="{ item }">
								<v-icon small @click="eliminarCupCitologia(item)" color="red"
									v-if="item.created_by === $store.state.auth.usuario.id">
									mdi-delete
								</v-icon>
							</template>
						</v-data-table>
					</template>
				</v-col>
				<v-col cols="12" md="12" sm="12">
					<v-alert text dense color="blue-grey" class="text-center"
						icon="mdi-checkbox-marked-circle-plus-outline" border="left">
						<b>MAMOGRAFIA</b>
					</v-alert>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-select name="input-7-1" :items="formatearCupMamografia" item-text="cupConcatenado"
						item-value="id" v-model="mamografiaCup.cup_mamografia" label="Seleccione el Tipo de Mamografia">
					</v-select>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-select :items="resultadosMamografias" label="Resultados"
						v-model="mamografiaCup.resultados"></v-select>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-text-field type="date" v-model="mamografiaCup.fecha_realizacion" :max="hoy"
						label="Fecha de Realizacion">
					</v-text-field>
				</v-col>
				<v-col cols="12" sm="6" md="1">
					<v-btn class="mx-2" fab dark color="indigo" @click="registrarCupMamografia()">
						<v-icon dark>
							mdi-plus
						</v-icon>
					</v-btn>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<template>
						<v-data-table :headers="headersMamografia" :items="mamografias" hide-default-footer
							class="elevation-1">
							<template v-slot:[`item.user.operador`]="{ item }">
								{{ `${item.user.operador?.nombre || ''} ${item.user.operador?.apellido || ''}`.trim() ||
									'Sin nombre' }}
							</template>
							<template v-slot:[`item.created_at`]="{ item }">
								{{ item.created_at.substring(0, 10) }}
							</template>
							<template v-slot:[`item.actions`]="{ item }">
								<v-icon small @click="eliminarCupMamografia(item)" color="red"
									v-if="item.created_by === $store.state.auth.usuario.id">
									mdi-delete
								</v-icon>
							</template>
						</v-data-table>
					</template>
				</v-col>
				<template v-if="ginecologico.presente_menarquia === 'Si'">

					<v-col cols="12" md="12" sm="12">
						<v-alert text dense color="blue-grey" class="text-center"
							icon="mdi-checkbox-marked-circle-plus-outline" border="left">
							<b>PROCEDIMIENTOS ANTERIORES EN EL CUELLO UTERINO</b>
						</v-alert>
					</v-col>
					<v-col xs="12" sm="6" md="2">
						<v-select v-model="ginecologico.presente_procedimiento_cuello_uterino" :items="sino"
							label="Procedimientos en el Cuello Uterino?">
						</v-select>

					</v-col>


					<v-col xs="12" sm="6" md="3" v-show="ginecologico.presente_procedimiento_cuello_uterino === 'Si'">
						<v-select v-model="ginecologico.tratamiento_procedimiento_cuello_uterino"
							v-if="ginecologico.presente_procedimiento_cuello_uterino === 'Si'"
							:items="trataminetouterino" label="Tratamiento Cuello Uterino">
						</v-select>



					</v-col>
					<v-col xs="12" sm="6" md="2" v-show="ginecologico.presente_procedimiento_cuello_uterino === 'Si'">
						<v-text-field type="date" v-model="ginecologico.fecha_procedimiento_cuello_uterino"
							label="Fecha procedimiento Cuello Uterino" :max="hoy">
						</v-text-field>
					</v-col>
					<template v-if="datos.cita.tipo_historia_id !== 1">
						<v-col cols="12" md="12" sm="12">
							<v-alert text dense color="blue-grey" class="text-center"
								icon="mdi-checkbox-marked-circle-plus-outline" border="left">
								<b>OTRO TIPO DE TRATAMIENTO</b>
							</v-alert>
						</v-col>
						<v-col xs="12" sm="6" md="6">
							<v-textarea name="input-7-1" v-model="ginecologico.tratamiento_otro_tipo_tratamiento"
								rows="1" label="Otro Tipo de Tratamiento">
							</v-textarea>
						</v-col>
					</template>
					<v-col cols="12" md="12" sm="12">
						<v-alert text dense color="blue-grey" class="text-center"
							icon="mdi-checkbox-marked-circle-plus-outline" border="left">
							<b>ANTECEDENTES OBSTETRICOS</b>
						</v-alert>
					</v-col>
					<v-col xs="12" sm="6" md="3">
						<v-select v-model="ginecologico.planea_embarazo" :items="sino"
							label="¿Planea embarazo antes de 1 año?:">
						</v-select>
					</v-col>
					<v-col cols="12" sm="6" md="3">
						<v-select label="Antecedentes obstetricos" :items="['Si', 'No']"
							v-model="ginecologico.antecedentes_obtetricos">
						</v-select>
					</v-col>
					<template v-if="this.ginecologico.antecedentes_obtetricos == 'Si'">
						<v-col xs="12" sm="3" md="3">
							<v-text-field type="date" v-model="ginecologico.fecha_ultimo_parto"
								label="Fecha ùltimo parto" :max="hoy">
							</v-text-field>
						</v-col>
						<v-col xs="12" sm="12" md="12">

						</v-col>
						<v-col xs="12" sm="6" md="2">
							<v-text-field type="number" v-model="ginecologico.gesta" label="Gestas (G)">
							</v-text-field>
						</v-col>
						<v-col xs="12" sm="6" md="2">
							<v-text-field type="number" v-model="ginecologico.parto" label="Partos (P)">
							</v-text-field>
						</v-col>
						<v-col xs="12" sm="6" md="1">
							<v-text-field type="number" v-model="ginecologico.aborto" label="Aborto (A)">
							</v-text-field>
						</v-col>
						<v-col xs="12" sm="6" md="1">
							<v-text-field type="number" v-model="ginecologico.vivos" label="Vivos (V)">
							</v-text-field>
						</v-col>
						<v-col xs="12" sm="6" md="1">
							<v-text-field type="number" v-model="ginecologico.cesarea" label="Cesarea (C)">
							</v-text-field>
						</v-col>
						<v-col xs="12" sm="6" md="1">
							<v-text-field type="number" v-model="ginecologico.mortinato" label="Mortinato (M)">
							</v-text-field>
						</v-col>
						<v-col xs="12" sm="6" md="2">
							<v-text-field type="number" v-model="ginecologico.ectopicos" label="Ectopicos (E)">
							</v-text-field>
						</v-col>
						<v-col xs="12" sm="6" md="1">
							<v-text-field type="number" v-model="ginecologico.molas" label="Molas">
							</v-text-field>
						</v-col>
						<v-col xs="12" sm="6" md="1">
							<v-text-field type="number" v-model="ginecologico.gemelos" label="Gemelos">
							</v-text-field>
						</v-col>
					</template>
					<v-col ls="12" sm="3" md="3" class="mt-3">
						<v-checkbox color="success" v-model="checkGestante" value="1"
							label="Marcar como gestante"></v-checkbox>
					</v-col>
				</template>

				<v-col cols="12" sm="12" md="12" v-if="checkGestante == true">
					<v-col xs="12">
						<v-row>
							<v-col xs="12" sm="12" md="12">
								<v-alert class="text-center" dense text outlined type="info" color="blue-grey"
									icon="mdi-book-open-page-variant">
									<b>GESTANTES</b></v-alert>
							</v-col>
							<v-col xs="12" sm="6" md="4">
								<v-text-field type="date" v-model="ginecologico.fecha_ultima_menstruacion_gestante"
									label="Fecha Ultima Menstruacion" :max="hoy">
								</v-text-field>
							</v-col>
							<v-col xs="12" sm="6" md="4">
								<v-text-field type="text" v-model="ginecologico.gestacional_fum"
									label="Edad Gestacional por FUM">
								</v-text-field>
							</v-col>
							<v-col xs="12" sm="6" md="4">
								<v-text-field v-model="ginecologico.fecha_probable" label="Fecha Probable de parto"
									readonly type="date">
								</v-text-field>
							</v-col>

							<v-col xs="12" sm="6" md="4">
								<v-select v-model="ginecologico.embarazo_deseado" :items="sino"
									label="Embarazo Deseado">
								</v-select>
							</v-col>
							<v-col xs="12" sm="6" md="4">
								<v-select v-model="ginecologico.embarazo_planeado" :items="sino"
									label="Embarazo Planeado">
								</v-select>
							</v-col>
							<v-col xs="12" sm="6" md="4">
								<v-select v-model="ginecologico.embarazo_aceptado" :items="sino"
									label="Embarazo Aceptado">
								</v-select>
							</v-col>
							<v-col xs="12" sm="6" md="3">
								<v-text-field type="date" v-model="ginecologico.fecha_pimera_eco"
									label="Fecha ecografía">
								</v-text-field>
							</v-col>
							<v-col xs="12" sm="6" md="3">
								<v-text-field type="number" v-model="ginecologico.gestacional_eco_1"
									label="Edad Gestacional en la Ecografia del 1er Trimestre">
								</v-text-field>
							</v-col>
							<v-col cols="12" sm="6" md="3">
								<v-text-field readonly v-model="ginecologico.edad_gestacional_ecografia1"
									label="Edad gestacional por ecografía 1(Calculada)"></v-text-field>
							</v-col>
							<v-col>
								<v-textarea name="input-7-1" v-model="ginecologico.descripcion_eco_1"
									label="Descripción" rows="1">
								</v-textarea>
							</v-col>

							<v-col xs="12" sm="6" md="3">
								<v-text-field type="date" v-model="ginecologico.fecha_segunda_eco"
									label="Fecha ecografía">
								</v-text-field>

							</v-col>
							<v-col xs="12" sm="6" md="3">
								<v-text-field type="number" v-model="ginecologico.gestacional_eco_2"
									label="Edad Gestacional en la ecografia del 2do Trimestre">
								</v-text-field>

							</v-col>
							<v-col cols="12" sm="6" md="3">
								<v-text-field label="Edad gestacional por ecografía 2 (Calculada) "
									v-model="ginecologico.edad_gestacional_ecografia2"></v-text-field>
							</v-col>
							<v-col xs="12" sm="6" md="3">
								<v-textarea name="input-7-1" v-model="ginecologico.descripcion_eco_2"
									label="Descripción" rows="1">
								</v-textarea>
							</v-col>

							<v-col xs="12" sm="6" md="3">
								<v-text-field type="date" v-model="ginecologico.fecha_tercera_eco"
									label="Fecha ecografía" :max="hoy">
								</v-text-field>

							</v-col>
							<v-col xs="12" sm="6" md="3">
								<v-text-field type="number" v-model="ginecologico.gestacional_eco_3"
									label="Edad Gestacional en la ecografia del 3er Trimestres"></v-text-field>

							</v-col>
							<v-col cols="12" sm="6" md="3">
								<v-text-field label="Edad gestacional por ecografía 3(Calculada)"
									v-model="ginecologico.edad_gestacional_ecografia3"></v-text-field>
							</v-col>
							<v-col xs="12" sm="6" md="3">
								<v-textarea name="input-7-1" v-model="ginecologico.descripcion_eco_3"
									label="Descripción" rows="1">
								</v-textarea>
							</v-col>
							<v-col xs="12" sm="12" md="6">
								<v-text-field type="number" v-model="ginecologico.gestacional_captacion"
									label="Semanas gestacionales a la captacion">
								</v-text-field>
							</v-col>
							<v-col cols="12" md="12" sm="12">
								<v-alert text dense color="blue-grey" class="text-center"
									icon="mdi-checkbox-marked-circle-plus-outline" border="left">
									<b>PATOLOGIAS</b>
								</v-alert>
							</v-col>

							<v-col xs="12" sm="4" md="5">
								<v-select v-model="gestante.patologias" :items="patologias"
									label="Patologias relacionadas con gestación"></v-select>
							</v-col>
							<v-col xs="12" sm="4" md="3">
								<v-select v-model="gestante.presente" :items="sino" label="Presente">
								</v-select>
							</v-col>
							<v-col xs="12" sm="4" md="3">
								<v-text-field type="date" v-model="gestante.fecha_patologia"
									label="Fecha de Diagnostico" :max="hoy">
								</v-text-field>
							</v-col>
							<v-col xs="1">
								<v-btn fab dark color="success" @click="Gestanteginecologico()" small>
									<v-icon dark>mdi-plus</v-icon>
								</v-btn>
							</v-col>
							<v-col xs="12" sm="12" d-flex>
								<v-data-table :items="fetchgestante" :headers="headerGestantes" hide-default-footer
									disable-pagination class="elevation-1">
									<template v-slot:[`item.eliminar`]="{ item, index }">
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<v-btn color="error" icon small v-on="on"
													@click="eliminarGestante(index, item.id)">
													<v-icon>mdi-delete</v-icon>
												</v-btn>
											</template>
											<span>Eliminar</span>
										</v-tooltip>
									</template>
								</v-data-table>
							</v-col>

							<v-col xs="12" sm="12" md="12" v-if="checkPuerpera == true">
								<v-alert class="text-center" dense text outlined type="info" color="blue-grey"
									icon="mdi-book-open-page-variant">
									<b>PUERPERA</b></v-alert>
							</v-col>
							<v-col xs="12" sm="12" md="12" v-if="checkPuerpera == true">
								<v-text-field type="number" v-model="ginecologico.semana_nacimineto"
									label="Semana al nacimiento">
								</v-text-field>
							</v-col>
							<v-col xs="12" sm="12" md="12" v-if="checkPuerpera == true">
								<v-textarea name="input-7-1" v-model="ginecologico.inconvenientes_lactancia"
									label="Inconvenientes e inquietudes sobre la lactancia">
								</v-textarea>
							</v-col>
							<v-col xs="12" sm="12" md="12" v-if="checkPuerpera == true">
								<v-textarea name="input-7-1" v-model="ginecologico.plan_lactancia_retorno"
									label="Planes de la madre para continuar con la lactancia durante el retorno al trabajo o estudios">
								</v-textarea>
							</v-col>
						</v-row>
					</v-col>
				</v-col>
			</v-row>
			<!-- <v-row>
                <v-col xs="12">

                        <v-card color="lighten-1" class="mb-5" height="auto">


                        </v-card>
                    </v-col>
            </v-row> -->
		</v-col>
	</v-form>
</template>
<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
	name: "",
	props: ['datos', 'resumen'],
	data() {
		return {
			checkGestante: '',
			checkPuerpera: '',
			mamografias: [],
			prueba: '',
			hoy: moment().format("YYYY-MM-DD"),
			fecha_inicio: '',
			gestante: {
				patologias: '',
				presente: '',
				fecha_patologia: '',
				paciente_id: ''
			},
			estadoCitologia: ['Normal', 'Anormal'],
			interginesico: ['Corto', 'Largo', 'No aplica'],
			gestacion: {
				patologias: '',
				presente: '',
				paciente_id: ''
			},
			dxMamografiaGinecologia: [{
				id: 7282,
				codigo: '892901',
				nombre: 'TOMA NO QUIRURGICA DE MUESTRA O TEJIDO CERVICOVAGINAL PARA ESTUDIO CITOLOGICO',
			},
			{
				id: 10035,
				codigo: '908436',
				nombre: 'DETECCION VIRUS DE PAPILOMA HUMANO PRUEBAS DE ADN',
			},

			],
			cupGinecologicos: [{
				id: 6613,
				codigo: '876802',
				nombre: 'MAMOGRAFIA BILATERAL',
			},],
			citologias: [],
			ginecologico: {
				antecedentes_obtetricos: null,
				tratamiento_metodo_anticonceptivo: null,
				fecha_ultima_menstruacion: null,
				presente_menarquia: null,
				edad: null,
				clasificacion_ciclos: null,
				frecuencia_ciclos: null,
				duracion_ciclos: null,
				presente_transmisionsexual: null,
				descripcion_transmision_sexual: null,
				edad_primera: null,
				presente_metodo_anticonceptivo: null,
				descripcion_metodo_anticonceptivo: null,
				tipo_metodo_anticonceptivo: null,
				fecha_metodo_anticonceptivo: null,
				presente_tratamiento_infertilidad: null,
				tratamiento_tratamiento_infertilidad: null,
				fecha_tratamiento_infertilidad: null,
				presente_auto_examen_senos: null,
				frecuencia_auto_examen_senos: null,
				fecha_citologia: null,
				resultado_citologia: null,
				fecha_mamografia: null,
				resultado_mamografia: null,
				presente_procedimiento_cuello_uterino: null,
				tratamiento_procedimiento_cuello_uterino: null,
				fecha_procedimiento_cuello_uterino: null,
				tratamiento_otro_tipo_tratamiento: null,
				fecha_ultimo_parto: null,
				planea_embarazo: 'No',
				gesta: null,
				parto: null,
				aborto: null,
				vivos: null,
				cesarea: null,
				mortinato: null,
				ectopicos: null,
				molas: null,
				gemelos: null,
				fecha_ultima_menstruacion_gestante: null,
				gestacional_fum: null,
				fecha_probable: null,
				embarazo_deseado: null,
				embarazo_planeado: null,
				embarazo_aceptado: null,
				fecha_pimera_eco: null,
				gestacional_eco_1: null,
				descripcion_eco_1: null,
				fecha_segunda_eco: null,
				gestacional_eco_2: null,
				descripcion_eco_2: null,
				fecha_tercera_eco: null,
				gestacional_eco_3: null,
				descripcion_eco_3: null,
				gestacional_captacion: null,
				// periodo_interginesico: null,
				descripcion_interginesico_corto: null,
				violencia_1: null,
				violencia_2: null,
				violencia_3: null,
				semana_nacimineto: null,
				inconvenientes_lactancia: null,
				plan_lactancia_retorno: null,
				edad_gestacional_ecografia1: null,
				edad_gestacional_ecografia2: null,
				edad_gestacional_ecografia3: null,
				menopausia_presente: null,
				fecha_inicio_menopausia: null,
			},
			CitologiaCervicouterina: {
				cup_citologia: '',
				fecha_realizacion: '',
				resultados: '',
			},
			mamografiaCup: {
				cup_mamografia: '',
				fecha_realizacion: '',
				resultados: '',
			},
			sino: ['Si', 'No'],
			frecuencia: ['15 días', '21 días', '28 días', '30 días', 'Otros',],
			clasificacion: ['Regulares', 'Irregulares'],
			duracion: ['1 Dias', '2 Dias', '3 Dias', '4 Dias', '5 Dias', '6 Dias', '7 Dias', '9 Dias', '10 Dias'],
			descripcionmetodo: ['Orales', 'Inyectables', 'Barrera', 'Mecanicos', 'Subdermicos',
				'Quirurgicos Reversibles', 'Definitivos'
			],
			tipometodo1: ['Condones', 'Diagfracma', 'DIU'],
			tipometodo2: ['Vasectomia', 'Tubectomia'],
			tipometodo3: ['Histerectomia'],
			frecuenciautoseno: ['Diario', 'Semanal', 'Quincenal', 'Mensual', 'Nunca'],
			trataminetouterino: ['Cauterizacion', 'Histerectomia', 'Conizacion', 'Radicacion', 'Otro'],
			patologias: ['Hipertension Inducida por el Embarazo', 'Sifilis Gestacional Congenita',
				'Placenta previa', 'Abruptio', 'Ant. Hemorragia posparto', 'Ant. Depresion posparto',
				'Complicaciones durante el parto', 'Ruptura Prematura de Membrana (RPM)',
				'Antecedente Parto prematuro', 'Malformaciones congenitas', 'RN Bajo peso', 'Macrosomicos',
				'Incompatibilidad RH', 'Multiparidad', 'La paciente tuvo consulta preconcepcional', 'epigastralgia',
				'Diabetes Pre-Gestacional', 'Hipoglicemias', 'Eclampsia',
				'Edema en cara o miembros superiores e inferiores',
				'Pre-Eclampsia', 'Sindrome de Hellp', 'Hiperemesis', 'Nulipara', 'Antecedentes de IVU ', 'Cefaleas',
				'Hemorroides', 'Nauseas', 'Vomito'
			],
			patologiasActuales: ['Presencia movimientos fetales', 'Antecedentes de IVU ',
				'Edema en cara o miembros superiores e inferiores', 'Cefaleas', 'Hemorroides',
				'Presencia epigastralgia', 'Nulipara', 'Multipara', 'Nauseas', 'Vomito'
			],
			fetchgestante: [],
			headerGestantes: [{
				text: 'id',
				value: 'id'
			},
			{
				text: 'Patologia',
				value: 'patologia',
			},
			{
				text: 'Presente',
				value: 'presente',
			},
			{
				text: 'Fecha DX',
				value: 'fecha_patologia',
			},
			{
				text: 'eliminar',
				value: 'eliminar',
			}
			],
			fetchgestacion: [],
			headerGestacion: [{
				text: 'id',
			},
			{
				text: 'Patologia',
			},
			{
				text: 'Presente',
			},
			{
				text: 'Medico',
			},
			{
				text: 'Fecha',
			},
			],
			headersCitologia: [
				{
					text: 'Tipo de Citologia',
					value: 'cup.nombre'
				},
				{
					text: 'Fecha Registro',
					value: 'created_at'
				},
				{
					text: 'Profesional que Registra',
					value: 'usuario_crea.operador.nombre_completo'
				},
				{
					text: 'Resultados',
					value: 'resultados'
				},
				{
					text: 'Fecha Realizacion',
					value: 'fecha_realizacion'
				},
				{
					text: 'Acciones',
					value: 'actions'
				}
			],
			headersMamografia: [
				{
					text: 'Cup',
					value: 'cup.nombre'
				},
				{
					text: 'Fecha registro',
					value: 'created_at'
				},
				{
					text: 'Medico',
					value: 'usuario_crea.operador.nombre_completo'
				},
				{
					text: 'Resultados',
					value: 'resultados'
				},
				{
					text: 'Fecha Realizacion',
					value: 'fecha_realizacion'
				},
				{
					text: 'Acciones',
					value: 'actions'
				}
			],
			resultados: [
				'ASC-US (celulas escamosas atipicas de significado indeterminado)',
				'ASC-H (celulas escamosas atipicas, de significado indeterminado sugestivo de LEI de alto grado).',
				'Lesion intraepitelial escamosa (LEI) de bajo grado - HPV (NIC I) (LEI BG)',
				'Lesion intraepitelial escamosa (LEI) de alto grado (NIC II-III CA IN SITU) (LEI AG)',
				'Lesion intraepitelial escamosa de alto grado sospechosa de infiltración',
				'Carcinoma de células escamosas (Escamo celular)',
				'Celulas endocervicales atipicas sin ningún otro significado',
				'Celulas endometriales atipicas sin ningún otro significado',
				'Celulas glandulares atipicas sin ningún otro significado',
				'Celulas endocervicales atipicas sospechosas de neoplasia',
				'Celulas endometriales atipicas sospechosas de neoplasia',
				'Celulas glandulares atipicas sospechosas de neoplasia',
				'Adenocarcinoma endocervical in situ',
				'Adenocarcinoma endocervical',
				'Adenocarcinoma endometrial',
				'Otras neoplasias',
				'Negativa para lesión intraepitelial o neoplasia'
			],
			resultadosVph: ['Detectado', 'No detectado'],
			resultadosMamografias: [
				'BIRADS 0: necesidad de nuevo estudio imagenológico o mamograma previo para evaluación',
				'BIRADS 1: negativo',
				'BIRADS 2: hallazgos benignos',
				'BIRADS 3: probablemente benigno',
				'BIRADS 4: anormalidad sospechosa',
				'BIRADS 5: altamente sospechoso de malignidad',
				'BIRADS 6: malignidad por biopsia conocida',
			],
		}
	},
	computed: {
		resultadosCondicionados() {
			return this.dxMamografiaGinecologia[1]?.id === this.CitologiaCervicouterina.cup_citologia
				? this.resultadosVph
				: this.resultados;
		},
		formatearDxMamografiaGinecologia() {
			return this.dxMamografiaGinecologia.map(item => {
				return {
					...item,
					cupConcatenado: `${item.codigo} - ${item.nombre}`,
				};
			});
		},
		formatearCupMamografia() {
			return this.cupGinecologicos.map(item => {
				return {
					...item,
					cupConcatenado: `${item.codigo} - ${item.nombre}`,
				}
			});
		},
		...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
	},
	created() {
		this.fetchGestante();
		// this.ginecologico = this.resumen;
	},
	watch: {
		"ginecologico.fecha_ultima_menstruacion_gestante": function () {
			this.calcularfechaProbableParto();
			this.calcularEdadGestacional();
		},

		"ginecologico.fecha_pimera_eco": function () {
			this.calcularEdadPorEcografia1()
		},

		"ginecologico.gestacional_eco_1": function () {
			this.calcularEdadPorEcografia1()
		},

		"ginecologico.fecha_segunda_eco": function () {
			this.calcularEdadPorEcografia2()
		},

		"ginecologico.gestacional_eco_2": function () {
			this.calcularEdadPorEcografia2()
		},

		"ginecologico.fecha_tercera_eco": function () {
			this.calcularEdadPorEcografia2()
		},

		"ginecologico.gestacional_eco_3": function () {
			this.calcularEdadPorEcografia3()
		}

	},
	mounted() {
		const datosGinecologicos = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/AntecedentesGinecologicos');
		if (datosGinecologicos) {
			this.ginecologico = { ...datosGinecologicos };
		} else {
			this.obtenerDatosGinecobstetricos();
		}
		this.fetchCupCitologia();
		this.test();

	},

	methods: {
		validarErrores() {
			return [];
		},
		eliminarGestante(index, id) {
			this.$axios.$delete('historia/eliminar-gestante-ginecologicos/' + id)
				.then(res => {
					this.fetchgestante.splice(index, 1)
					this.fetchGestante();
				})
		},
		Gestanteginecologico() {
			this.$axios.post('historia/guardar-gestante-ginecologicos/' + this.datos.id, this.gestante)
				.then(res => {
					this.fetchGestante();
				})
		},
		fetchGestante() {
			this.$axios.get(`historia/gestante-ginecologicos/${this.datos.id}`)
				.then(res => {
					this.fetchgestante = res.data;
				});
		},
		calcularfechaProbableParto() {
			if (this.ginecologico.fecha_ultima_menstruacion_gestante == null) {
				this.ginecologico.fecha_probable = null;
			} else {
				// Sumar 7 días a la fecha de la última menstruación
				let fecha_inicio = moment(this.ginecologico.fecha_ultima_menstruacion_gestante).add(7, 'days');
				// Sumar 9 meses para calcular la fecha probable de parto
				let fecha_probable = fecha_inicio.add(9, 'months');
				// Formatear la fecha en el formato "YYYY-MM-DD" para el campo de tipo date
				this.ginecologico.fecha_probable = fecha_probable.format("YYYY-MM-DD");
			}
		},

		calcularEdadPorEcografia1() {
			const {
				fecha_pimera_eco,
				gestacional_eco_1
			} = this.ginecologico;
			if (!fecha_pimera_eco || !gestacional_eco_1) {
				this.ginecologico.edad_gestacional_ecografia1 = null;
				return;
			}
			const fechaEco = moment(fecha_pimera_eco);
			const fechaHoy = moment();

			// Diferencia en días entre hoy y la fecha de la ecografía
			const diferenciaDias = fechaHoy.diff(fechaEco, 'days');

			// Convertir días a semanas
			const semanasDiferencia = diferenciaDias / 7;

			// Sumar la edad gestacional inicial ingresada
			let edadGestacional = parseFloat(gestacional_eco_1) + semanasDiferencia;

			// Redondear según el criterio dado (>= 0.7 hacia arriba)
			this.ginecologico.edad_gestacional_ecografia1 =
				(edadGestacional % 1 >= 0.7) ? Math.ceil(edadGestacional) : edadGestacional.toFixed(1);
		},


		calcularEdadPorEcografia2() {
			const {
				fecha_segunda_eco,
				gestacional_eco_2
			} = this.ginecologico;
			if (!fecha_segunda_eco || !gestacional_eco_2) {
				this.ginecologico.edad_gestacional_ecografia2 = null;
				return;
			}
			const fechaEco = moment(fecha_segunda_eco);
			const fechaHoy = moment();

			// Diferencia en días entre hoy y la fecha de la ecografía
			const diferenciaDias = fechaHoy.diff(fechaEco, 'days');

			// Convertir días a semanas
			const semanasDiferencia = diferenciaDias / 7;

			// Sumar la edad gestacional inicial ingresada
			let edadGestacional = parseFloat(gestacional_eco_2) + semanasDiferencia;

			// Redondear según el criterio dado (>= 0.7 hacia arriba)
			this.ginecologico.edad_gestacional_ecografia2 =
				(edadGestacional % 1 >= 0.7) ? Math.ceil(edadGestacional) : edadGestacional.toFixed(1);
		},

		calcularEdadPorEcografia3() {
			const {
				fecha_tercera_eco,
				gestacional_eco_3
			} = this.ginecologico;
			if (!fecha_tercera_eco || !gestacional_eco_3) {
				this.ginecologico.edad_gestacional_ecografia3 = null;
				return;
			}
			const fechaEco = moment(fecha_tercera_eco);
			const fechaHoy = moment();

			// Diferencia en días entre hoy y la fecha de la ecografía
			const diferenciaDias = fechaHoy.diff(fechaEco, 'days');

			// Convertir días a semanas
			const semanasDiferencia = diferenciaDias / 7;

			// Sumar la edad gestacional inicial ingresada
			let edadGestacional = parseFloat(gestacional_eco_3) + semanasDiferencia;

			// Redondear según el criterio dado (>= 0.7 hacia arriba)
			this.ginecologico.edad_gestacional_ecografia3 =
				(edadGestacional % 1 >= 0.7) ? Math.ceil(edadGestacional) : edadGestacional.toFixed(1);
		},

		calcularEdadGestacional() {
			const {
				fecha_ultima_menstruacion_gestante
			} = this.ginecologico;
			if (!fecha_ultima_menstruacion_gestante) {
				this.ginecologico.gestacional_fum = null;
			} else {
				const diferenciaDias = moment().diff(moment(fecha_ultima_menstruacion_gestante), 'days');
				let edadGestacional = diferenciaDias / 7;
				this.ginecologico.gestacional_fum = (edadGestacional % 1 >= 0.7) ? Math.ceil(edadGestacional) :
					edadGestacional.toFixed(1);
			}
		},


		clear() {
			this.gestante.patologias = '',
				this.gestante.presente = '',
				this.gestante.fecha_patologia = '',
				this.gestacion.patologias = '',
				this.gestacion.presente = ''
		},


		obtenerDatosGinecobstetricos() {
			this.$axios.get(`historia/obtenerDatosGinecobstetricos/${this.datos.afiliado.id}`)
				.then(res => {
					Object.keys(res.data).forEach(key => {
						this.$set(this.ginecologico, key, res.data[key]);
					});
				})
				.catch(error => {
					console.error('Error al obtener los datos:', error);
					this.$toast.error('Error al obtener los datos del estilo de vida');
				});
		},
		registrarCupCitologia() {
			this.$axios.post('historia/cup-citologia/' + this.datos.id, {
				citologia: this.CitologiaCervicouterina.cito,
				cup_citologia: this.CitologiaCervicouterina.cup_citologia,
				descripcion_citologia: this.CitologiaCervicouterina.descripcion_citologia,
				resultados: this.CitologiaCervicouterina.resultados,
				fecha_realizacion: this.CitologiaCervicouterina.fecha_realizacion,
				afiliado_id: this.datos.afiliado.id,
				consulta_id: this.datos.id
			})
				.then(res => {
					this.limpiarFormulario();
					this.fetchCupCitologia();
					this.removerDataGinecologia()
				})
		},
		registrarCupMamografia() {
			this.$axios.post('historia/cup-mamografia/' + this.datos.id, {
				consulta_id: this.datos.id,
				mamografiaPR: this.mamografiaCup.mamografiaPR,
				cup_mamografia: this.mamografiaCup.cup_mamografia,
				descripcion_mamografia: this.mamografiaCup.descripcion_mamografia,
				resultados: this.mamografiaCup.resultados,
				fecha_realizacion: this.mamografiaCup.fecha_realizacion,
				afiliado_id: this.datos.afiliado.id
			})
				.then(res => {
					this.test();
					this.removerDataMamografias()
				})
		},
		removerDataMamografias() {
			this.mamografiaCup.mamografiaPR = null,
				this.mamografiaCup.descripcion_mamografia = null,
				this.mamografiaCup.cup_mamografia = null
		},
		fetchCupCitologia() {
			this.$axios.get('historia/cup-citologia/' + this.datos.afiliado.id)
				.then(res => {
					this.citologias = res.data;
				})
		},
		test() {
			this.$axios.get('historia/cup-mamografia/' + this.datos.afiliado.id)
				.then(res => {
					this.mamografias = res.data;
				})
		},

		removerDataGinecologia() {
			this.CitologiaCervicouterina.citologia = null,
				this.CitologiaCervicouterina.descripcion_citologia = null,
				this.CitologiaCervicouterina.cup_citologia = null
		},

		eliminarCupMamografia(item) {
			this.$axios.delete('historia/eliminarMamomgrafia/' + item.id).then((res) => {
				this.$toast.success('Cup eliminado con exito');
				this.test()
			}).catch((error) => {
				this.$toast.error('error al eliminar')
			})
		},

		eliminarCupCitologia(item) {
			this.$axios.delete('historia/eliminarCitologia/' + item.id).then(() => {
				this.$toast.success('Cup eliminado con exito');
				this.fetchCupCitologia()
			}).catch(() => {
				this.$toast.error('error al eliminar')
			})
		},

		limpiarFormulario() {
			this.CitologiaCervicouterina = {
				cup_citologia: null,
				fecha_realizacion: null,
				resultados: null,
			}
		},
		obtenerDatos() {
			return {
				datos: this.ginecologico
			};
		},
	}
}

</script>
