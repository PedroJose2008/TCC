package br.com.TCC.TCC.entity;

import java.io.Serializable;
import java.time.LocalDate;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "KitPeca")
public class KitPecaEntity implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "idKit")
	private KitEntity kit;
	
	@ManyToOne
	@JoinColumn(name = "idPeca")
	private PecaEntity peca;
	
	
	private int quantidade;
	private LocalDate dataCadastro;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	
	public int getQuantidade() {
		return quantidade;
	}
	public void setQuantidade(int quantidade) {
		this.quantidade = quantidade;
	}
	public LocalDate getDataCadastro() {
		return dataCadastro;
	}
	public void setDataCadastro(LocalDate dataCadastro) {
		this.dataCadastro = dataCadastro;
	}
	public KitEntity getKit() {
		return kit;
	}
	public void setKit(KitEntity kit) {
		this.kit = kit;
	}
	public PecaEntity getPeca() {
		return peca;
	}
	public void setPeca(PecaEntity peca) {
		this.peca = peca;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	
	

	
}
