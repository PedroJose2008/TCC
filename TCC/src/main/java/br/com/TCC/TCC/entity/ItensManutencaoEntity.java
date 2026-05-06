package br.com.TCC.TCC.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "ItensManutencao")
public class ItensManutencaoEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	//@ManyToOne
	//@JoinColumn(name = "idPeca")
	//private PecaEntity peca;
	
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	@ManyToOne
	@JoinColumn(name = "idManutencao")
	private ManutencaoEntity manutencao;
	
	private String ordermServico;
	private int quantidade;
	private LocalDate dataCadastro;
	private float precoManutencao;
	
	
	

	public LocalDate getDataCadastro() {
		return dataCadastro;
	}
	public void setDataCadastro(LocalDate dataCadastro) {
		this.dataCadastro = dataCadastro;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public ManutencaoEntity getManutencao() {
		return manutencao;
	}
	public void setManutencao(ManutencaoEntity manutencao) {
		this.manutencao = manutencao;
	}
	public String getOrdermServico() {
		return ordermServico;
	}
	public void setOrdermServico(String ordermServico) {
		this.ordermServico = ordermServico;
	}
	public int getQuantidade() {
		return quantidade;
	}
	public void setQuantidade(int quantidade) {
		this.quantidade = quantidade;
	}
	
	public float getPrecoManutencao() {
		return precoManutencao;
	}
	public void setPrecoManutencao(float precoManutencao) {
		this.precoManutencao = precoManutencao;
	}
	
	
	
	
}
