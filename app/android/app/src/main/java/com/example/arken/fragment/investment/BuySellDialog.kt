package com.example.arken.fragment.investment

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.DialogFragment
import com.example.arken.R
import com.example.arken.fragment.signup_login.LoginFragment
import com.example.arken.model.investment.Account
import com.example.arken.model.investment.Deposit
import com.example.arken.model.tradingEquipment.Current
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception
import java.math.RoundingMode

class BuySellDialog (val onDepositClickListener: DepositClickListener,var currentRates:MutableList<Current>): DialogFragment(),
    AdapterView.OnItemSelectedListener{
    private lateinit var teqSpinner: Spinner
    private lateinit var buysellSpinner: Spinner
   private val buysellarray = arrayOf("BUY","SELL")
    private val teqarray = arrayOf("TRY","USD","AUD","CNY","HKD","INR","JPY","AED","LTC","XRP","ETH","BTC","FB","AMZN","AAPL","MSFT","GOOG")
private lateinit var curr:String
private var isbuy=true
    private lateinit var currentValue:TextView
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        val rootView: View = inflater.inflate(R.layout.fragment_buysell_dialog, container, false)
        buysellSpinner=rootView.findViewById(R.id.buysell_spinner)
        teqSpinner=rootView.findViewById(R.id.buysell_currency_spinner)
        currentValue=rootView.findViewById(R.id.currentValueBuysell)
        var submit_button = rootView.findViewById<Button>(R.id.submit_buysell_button)
        var cancel_button = rootView.findViewById<Button>(R.id.cancel_buysell_button)
        var amount_editText = rootView.findViewById<EditText>(R.id.amountBuysellEditText)
        ArrayAdapter(
            context!!,
            R.layout.custom_spinner, buysellarray
        ).also { adapter ->
            buysellSpinner.adapter = adapter
        }
        buysellSpinner.onItemSelectedListener = this
        buysellSpinner.setSelection(0)

        ArrayAdapter(
            context!!,
            R.layout.custom_spinner, teqarray
        ).also { adapter ->
            teqSpinner.adapter = adapter
        }
        teqSpinner.onItemSelectedListener = this
        teqSpinner.setSelection(0)
        val c = currentRates.filter { it.from==teqarray[0] }
        val k:String=c.get(0).rate.toBigDecimal().setScale(4, RoundingMode.HALF_EVEN).toString()
        currentValue.text="Current Value Of ${c.get(0).from}/${c.get(0).to} = ${k}"
        cancel_button.setOnClickListener(object : View.OnClickListener {
            override fun onClick(v: View?) {
                dismiss()
            }
        })

        submit_button.setOnClickListener(object : View.OnClickListener {
            override fun onClick(v: View?) {
                var amount: Double
                if (amount_editText.text.isNotEmpty() ){
                    try {
                        amount=amount_editText.text.toString().toDouble()
                        if(isbuy) {
                            val call: Call<Account> = RetroClient.getInstance().apiService.buyTeq(
                                activity!!.getSharedPreferences(
                                    LoginFragment.MY_PREFS_NAME,
                                    Context.MODE_PRIVATE
                                )
                                    .getString("user_cookie", "defaultCookie")
                                , Deposit(amount, curr, null)
                            )



                            call.enqueue(object : Callback<Account> {
                                override fun onResponse(
                                    call: Call<Account>,
                                    response: Response<Account>
                                ) {
                                    if (response.isSuccessful) {
                                        Toast.makeText(
                                            context,
                                            "Buy Successful",
                                            Toast.LENGTH_SHORT
                                        ).show()
                                        onDepositClickListener.onDepositClick()
                                        dismiss()

                                    } 
                                }

                                override fun onFailure(call: Call<Account>, t: Throwable) {
                                }
                            })
                        }else{
                            val call: Call<Account> = RetroClient.getInstance().apiService.sellTeq(
                                activity!!.getSharedPreferences(
                                    LoginFragment.MY_PREFS_NAME,
                                    Context.MODE_PRIVATE
                                )
                                    .getString("user_cookie", "defaultCookie")
                                , Deposit(amount, curr, null)
                            )



                            call.enqueue(object : Callback<Account> {
                                override fun onResponse(
                                    call: Call<Account>,
                                    response: Response<Account>
                                ) {
                                    if (response.isSuccessful) {
                                        Toast.makeText(
                                            context,
                                            "Sell Successful",
                                            Toast.LENGTH_SHORT
                                        ).show()
                                        onDepositClickListener.onDepositClick()
                                        dismiss()

                                    }
                                }

                                override fun onFailure(call: Call<Account>, t: Throwable) {
                                }
                            })
                        }
                        }catch (e: Exception){

                    }
                }


            }
        })



        return rootView
    }

    override fun onNothingSelected(parent: AdapterView<*>?) {
    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        val spin :Spinner = parent as Spinner
        if(spin.getId() == R.id.buysell_spinner){
            isbuy = position == 0
        }
        if(spin.getId() == R.id.buysell_currency_spinner){
            curr=teqarray[position]
            val c = currentRates.filter { it.from==teqarray[position] }
            val k:String=c.get(0).rate.toBigDecimal().setScale(4, RoundingMode.HALF_EVEN).toString()

            currentValue.text="Current Value Of ${c.get(0).from}/${c.get(0).to} = ${k}"
        }
    }
}