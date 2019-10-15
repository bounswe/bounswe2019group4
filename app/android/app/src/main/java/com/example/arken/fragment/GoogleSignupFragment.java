package com.example.arken.fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import com.example.arken.R;
import com.example.arken.model.SignupUser;
import com.example.arken.util.RetroClient;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class GoogleSignupFragment extends Fragment implements View.OnClickListener {
    private String userName;
    private String userSurname;
    private String userEmail;
    private EditText password1EditText;
    private EditText password2EditText;
    private Switch isTraderSwitch;
    private Button submitButton;
    private EditText ibanEditText;
    private EditText tcknEditText;
    private ImageView password1EyeImage;
    private ImageView password2EyeImage;
    public static GoogleSignupFragment newInstance(String name, String surname, String email) {
        GoogleSignupFragment f = new GoogleSignupFragment();
        // Supply index input as an argument.
        Bundle args = new Bundle();
        args.putString("name", name);
        args.putString("surname", surname);
        args.putString("email", email);
        f.setArguments(args);
        return f;
    }

    @SuppressLint("ClickableViewAccessibility")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_signup_google, container, false);
        Bundle args = getArguments();
        userName = args.getString("name","");
        userSurname = args.getString("surname", "");
        userEmail = args.getString("email","");
        ibanEditText = view.findViewById(R.id.signup_google_iban_editText);
        tcknEditText = view.findViewById(R.id.signup_google_tckn_editText);
        ConstraintLayout layout = view.findViewById(R.id.signup_google_background);
        layout.setOnClickListener(this);
        password1EditText = view.findViewById(R.id.signup_google_password1_editText);
        password2EditText = view.findViewById(R.id.signup_google_password2_editText);
        submitButton = view.findViewById(R.id.signup_google_submit_button);
        submitButton.setOnClickListener(this);
        isTraderSwitch = view.findViewById(R.id.signup_google_isTrader_switch);
        isTraderSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) {
                    ibanEditText.setVisibility(View.VISIBLE);
                    tcknEditText.setVisibility(View.VISIBLE);
                } else {
                    ibanEditText.setVisibility(View.GONE);
                    tcknEditText.setVisibility(View.GONE);
                }
            }
        });
        password1EyeImage = view.findViewById(R.id.signup_google_password1_eye_image);
        password2EyeImage = view.findViewById(R.id.lsignup_google_password2_eye_image);
        password1EyeImage.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                switch(motionEvent.getAction()){
                    case MotionEvent.ACTION_DOWN:
                        password1EditText.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                        return true;
                    case MotionEvent.ACTION_UP:
                        password1EditText.setTransformationMethod(PasswordTransformationMethod.getInstance());
                        return true;
                    default:
                        return false;

                }
            }
        });
        password2EyeImage.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                switch(motionEvent.getAction()){
                    case MotionEvent.ACTION_DOWN:
                        password2EditText.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                        return true;
                    case MotionEvent.ACTION_UP:
                        password2EditText.setTransformationMethod(PasswordTransformationMethod.getInstance());
                        return true;
                    default:
                        return false;

                }
            }
        });
        return view;
    }

    @Override
    public void onClick(View view) {
        if (view.getId() != R.id.signup_google_iban_editText && view.getId() != R.id.signup_google_password1_editText &&
                view.getId() != R.id.signup_google_password2_editText && view.getId() != R.id.signup_google_tckn_editText){
            InputMethodManager inputMethodManager = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }
        if (view.getId() == R.id.signup_google_submit_button) {
            if (password1EditText.getText().toString().trim().equals("")) {
                password1EditText.setError("Please enter your password");
                return;
            }
            if (password2EditText.getText().toString().trim().equals("")) {
                password2EditText.setError("Please validate your password");
                return;
            }

            String password1 = String.valueOf(password1EditText.getText());
            String password2 = String.valueOf(password2EditText.getText());
            if(!password1.equals(password2)){
                password2EditText.setError("The passwords are not equal");
                return;
            }
            //TODO: add map fragment
            String location = "Turkey";
            Boolean isTrader = isTraderSwitch.isChecked();
            if (isTrader){
                if (tcknEditText.getText().toString().trim().equals("")) {
                    tcknEditText.setError("Please enter your TC");
                    return;
                }
                if (ibanEditText.getText().toString().trim().equals("")) {
                    ibanEditText.setError("Please enter your iban");
                    return;
                }
            }
            Call<ResponseBody> call;
            if (isTrader) {
                String tckn=String.valueOf(tcknEditText.getText());
                String iban=String.valueOf(ibanEditText.getText());
                //TODO: token id will be sent to backend
                call = RetroClient.getInstance().getAPIService().signup(new SignupUser(userName,
                        userSurname, userEmail, password1, location,isTrader,tckn,iban));
            } else {
                call = RetroClient.getInstance().getAPIService().signup(new SignupUser(userName,
                        userSurname, userEmail, password1, location));
            }

            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), "You are registered!", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(getContext(), response.raw().toString(), Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Toast.makeText(getContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }
    }
}