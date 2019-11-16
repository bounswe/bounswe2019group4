package com.example.arken.viewModel

import android.app.Application
import android.provider.Settings
import android.widget.Toast
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class TradingEquipmentViewModel(application: Application) : AndroidViewModel(application) {
    val data: MutableLiveData<Currency> = MutableLiveData()
    fun setData(code: String) {
        val call: Call<Currency> = RetroClient.getInstance().apiService.getCurrency(code)
            call.enqueue(
            object : Callback<Currency> {
                override fun onResponse(call: Call<Currency>, response: Response<Currency>) {
                    System.out.println("free")
                    if (response.isSuccessful) {
                        val currency: Currency? = response.body()
                        if (currency != null) {
                            data.value = currency

                        }
                    }else{
                        System.out.println("free")
                    }
                }

                override fun onFailure(call: Call<Currency>, t: Throwable) {
                    System.out.println(t.message)
                }
            }
        )
    }

    fun followUnfollow(k:String,b:String){
        System.out.println("folow run")
        val call: Call<Currency> = RetroClient.getInstance().apiService.followCurrency(k,b)
        call.enqueue(
            object : Callback<Currency> {
                override fun onResponse(call: Call<Currency>, response: Response<Currency>) {
                    if (response.isSuccessful) {
                        System.out.println("Successfull follow")
                    }else{
                        System.out.println(response.code())
                    }
                }

                override fun onFailure(call: Call<Currency>, t: Throwable) {
                    System.out.println(t.message)
                }
            }
        )
    }
}