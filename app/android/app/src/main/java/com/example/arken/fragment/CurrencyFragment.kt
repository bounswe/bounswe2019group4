package com.example.arken.fragment

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProviders
import androidx.navigation.fragment.navArgs
import com.example.arken.R
import com.example.arken.viewModel.TradingEquipmentViewModel

class CurrencyFragment :Fragment(){

    private lateinit var tradingEquipmentViewModel: TradingEquipmentViewModel
    private val args: CurrencyFragmentArgs by navArgs()
    @SuppressLint("ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_currency, container, false)
        tradingEquipmentViewModel = ViewModelProviders.of(this).get(TradingEquipmentViewModel::class.java)
        return view
    }



    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

    }
}