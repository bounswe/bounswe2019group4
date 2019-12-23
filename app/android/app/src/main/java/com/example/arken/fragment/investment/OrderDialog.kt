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
import com.example.arken.model.investment.Order
import com.example.arken.model.investment.enums.Compare
import com.example.arken.model.investment.enums.Type
import com.example.arken.model.tradingEquipment.Current
import com.example.arken.util.RetroClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception
import java.math.RoundingMode

class OrderDialog (val onDepositClickListener: DepositClickListener,var currentRates:MutableList<Current>): DialogFragment(),
    AdapterView.OnItemSelectedListener{
    private lateinit var teqSpinner: Spinner
    private lateinit var buysellSpinner: Spinner
    private lateinit var compSpinner: Spinner
    private val buysellarray = arrayOf("BUY","SELL")
    private val teqarray = arrayOf("TRY","USD","AUD","CNY","HKD","INR","JPY","AED","LTC","XRP","ETH","BTC","FB","AMZN","AAPL","MSFT","GOOG")
    private val compArray = arrayOf("HIGHER","LOWER")
    private lateinit var curr:String
    private var isbuy=true
    private lateinit var currentValue: TextView
    private lateinit var orderTex: TextView
    private lateinit var amount_editText :EditText
    private lateinit var compamount_editText:EditText
    private var compEnum=Compare.HIGHER
    var  c = currentRates
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        val rootView: View = inflater.inflate(R.layout.fragment_order_dialog, container, false)
        buysellSpinner=rootView.findViewById(R.id.order_spinner)
        teqSpinner=rootView.findViewById(R.id.order_currency_spinner)
        compSpinner=rootView.findViewById(R.id.order_comparison_spinner)
        currentValue=rootView.findViewById(R.id.currentValueorder)
        var submit_button = rootView.findViewById<Button>(R.id.submit_order_button)
        var cancel_button = rootView.findViewById<Button>(R.id.cancel_order_button)
         amount_editText = rootView.findViewById<EditText>(R.id.amountorderEditText)
         compamount_editText = rootView.findViewById<EditText>(R.id.comparisonValueEditText)
        orderTex=rootView.findViewById(R.id.orderText)
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
        ArrayAdapter(
            context!!,
            R.layout.custom_spinner, compArray
        ).also { adapter ->
            compSpinner.adapter = adapter
        }
        compSpinner.onItemSelectedListener = this
        compSpinner.setSelection(0)
        c = currentRates.filter { it.from==teqarray[0] } as MutableList<Current>
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
                var comAmount:Double
                if (amount_editText.text.isNotEmpty() && compamount_editText.text.isNotEmpty() ){
                    try {
                        amount=amount_editText.text.toString().toDouble()
                        comAmount=compamount_editText.text.toString().toDouble()
                        if(isbuy) {
                            val call: Call<ResponseBody> = RetroClient.getInstance().apiService.sendOrder(
                                activity!!.getSharedPreferences(
                                    LoginFragment.MY_PREFS_NAME,
                                    Context.MODE_PRIVATE
                                )
                                    .getString("user_cookie", "defaultCookie")
                                , Order(null,compEnum,null,Type.BUY,amount,curr,comAmount,null)
                            )



                            call.enqueue(object : Callback<ResponseBody> {
                                override fun onResponse(
                                    call: Call<ResponseBody>,
                                    response: Response<ResponseBody>
                                ) {
                                    if (response.isSuccessful) {
                                        Toast.makeText(
                                            context,
                                            "Order Successful",
                                            Toast.LENGTH_SHORT
                                        ).show()
                                        onDepositClickListener.onDepositClick()
                                        dismiss()

                                    } else {
                                        Toast.makeText(
                                            context,
                                            response.raw().toString(),
                                            Toast.LENGTH_SHORT
                                        )
                                            .show()
                                    }
                                }

                                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                                }
                            })
                        }else{
                            val call: Call<ResponseBody> = RetroClient.getInstance().apiService.sendOrder(
                                activity!!.getSharedPreferences(
                                    LoginFragment.MY_PREFS_NAME,
                                    Context.MODE_PRIVATE
                                )
                                    .getString("user_cookie", "defaultCookie")
                                , Order(null,compEnum,null,Type.SELL,amount,curr,comAmount,null)
                            )



                            call.enqueue(object : Callback<ResponseBody> {
                                override fun onResponse(
                                    call: Call<ResponseBody>,
                                    response: Response<ResponseBody>
                                ) {
                                    if (response.isSuccessful) {
                                        Toast.makeText(
                                            context,
                                            "Order Successful",
                                            Toast.LENGTH_SHORT
                                        ).show()
                                        onDepositClickListener.onDepositClick()
                                        dismiss()

                                    } else {
                                        Toast.makeText(
                                            context,
                                            response.raw().toString(),
                                            Toast.LENGTH_SHORT
                                        )
                                            .show()
                                    }
                                }

                                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
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
        val spin : Spinner = parent as Spinner

        if(spin.getId() == R.id.order_spinner){
            isbuy = position == 0
        }
        if(spin.getId() == R.id.order_currency_spinner){
            curr=teqarray[position]
            c = currentRates.filter { it.from==teqarray[position] } as MutableList<Current>
            val k:String=c.get(0).rate.toBigDecimal().setScale(4, RoundingMode.HALF_EVEN).toString()

            currentValue.text="Current Value Of ${c.get(0).from}/${c.get(0).to} = ${k}"
        }
        if(spin.id==R.id.order_comparison_spinner){
if(position==0){
    compEnum=Compare.HIGHER
}else{
    compEnum=Compare.LOWER
}


        }
        if(amount_editText.text.isNotEmpty()&&compamount_editText.text.isNotEmpty()){
            if(isbuy) {
                orderTex.text =
                    "Buy ${amount_editText.text.toString()} ${c[0].from} when  ${c[0].from}/EUR is ${compEnum.toString().toLowerCase()} than ${compamount_editText.text}"
            }else{
                orderTex.text =
                    "Sell ${amount_editText.text.toString()} ${c[0].from} when  ${c[0].from}/EUR is ${compEnum.toString().toLowerCase()} than ${compamount_editText.text}"
            }
        }
    }
}